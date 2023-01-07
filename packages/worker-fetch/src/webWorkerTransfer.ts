import { isImageBitmap, isArrayBuffer } from './util';
import { AJAXError } from './Request';

type SerializedObject<S extends Serialized = any> = {
  [_: string]: S;
};

export type Serialized =
  | null
  | void
  | boolean
  | number
  | string
  | boolean
  | number
  | string
  | Date
  | RegExp
  | ArrayBuffer
  | ArrayBufferView
  | ImageData
  | ImageBitmap
  | Blob
  | Array<Serialized>
  | SerializedObject;

type Registry = {
  [_: string]: {
    klass: {
      new (...args: any): any;
      deserialize?: (input: Serialized) => unknown;
    };
    omit: ReadonlyArray<string>;
    shallow: ReadonlyArray<string>;
  };
};

type RegisterOptions<T> = {
  omit?: ReadonlyArray<keyof T>;
  shallow?: ReadonlyArray<keyof T>;
};

const registry: Registry = {};

/**
 * Register the given class as serializable.
 *
 * @param name
 * @param klass
 * @param options
 * @param options.omit List of properties to omit from serialization (e.g., cached/computed properties)
 * @param options.shallow List of properties that should be serialized by a simple shallow copy, rather than by a recursive call to serialize().
 *
 * @private
 */
export function register<T>(
  name: string,
  klass: {
    new (...args: any): T;
  },
  options: RegisterOptions<T> = {},
) {
  if (registry[name]) throw new Error(`${name} is already registered.`);
  (Object.defineProperty as any)(klass, '_classRegistryKey', {
    value: name,
    writeable: false,
  });
  registry[name] = {
    klass,
    omit: (options.omit as ReadonlyArray<string>) || [],
    shallow: (options.shallow as ReadonlyArray<string>) || [],
  };
}

register('Object', Object);
register('Error', Error);
register('AJAXError', AJAXError);

/**
 * Serialize the given object for transfer to or from a web worker.
 *
 * For non-builtin types, recursively serialize each property (possibly
 * omitting certain properties - see register()), and package the result along
 * with the constructor's `name` so that the appropriate constructor can be
 * looked up in `deserialize()`.
 *
 * If a `transferables` array is provided, add any transferable objects (i.e.,
 * any ArrayBuffers or ArrayBuffer views) to the list. (If a copy is needed,
 * this should happen in the client code, before using serialize().)
 *
 * @private
 */
export function serialize(input: unknown, transferables?: Array<Transferable> | null): Serialized {
  if (
    input === null ||
    input === undefined ||
    typeof input === 'boolean' ||
    typeof input === 'number' ||
    typeof input === 'string' ||
    input instanceof Boolean ||
    input instanceof Number ||
    input instanceof String ||
    input instanceof Date ||
    input instanceof RegExp ||
    input instanceof Blob
  ) {
    return input;
  }

  if (isArrayBuffer(input)) {
    if (transferables) {
      transferables.push(input);
    }
    return input;
  }

  if (isImageBitmap(input)) {
    if (transferables) {
      transferables.push(input);
    }
    return input;
  }

  if (ArrayBuffer.isView(input)) {
    const view = input;
    if (transferables) {
      transferables.push(view.buffer);
    }
    return view;
  }

  if (input instanceof ImageData) {
    if (transferables) {
      transferables.push(input.data.buffer);
    }
    return input;
  }

  if (Array.isArray(input)) {
    const serialized: Array<Serialized> = [];
    for (const item of input) {
      serialized.push(serialize(item, transferables));
    }
    return serialized;
  }

  if (typeof input === 'object') {
    const klass = input.constructor as any;
    const name = klass._classRegistryKey;
    if (!name) {
      throw new Error("can't serialize object of unregistered class");
    }
    if (!registry[name]) throw new Error(`${name} is not registered.`);

    const properties: SerializedObject = klass.serialize
      ? // (Temporary workaround) allow a class to provide static
        // `serialize()` and `deserialize()` methods to bypass the generic
        // approach.
        // This temporary workaround lets us use the generic serialization
        // approach for objects whose members include instances of dynamic
        // StructArray types. Once we refactor StructArray to be static,
        // we can remove this complexity.
        (klass.serialize(input, transferables) as SerializedObject)
      : {};

    if (!klass.serialize) {
      for (const key in input) {
        // any cast due to https://github.com/facebook/flow/issues/5393
        // eslint-disable-next-line no-continue
        if (!(input as any).hasOwnProperty(key)) continue; // eslint-disable-line no-prototype-builtins
        // eslint-disable-next-line no-continue
        if (registry[name].omit.indexOf(key) >= 0) continue;
        const property = (input as any)[key];
        properties[key] =
          registry[name].shallow.indexOf(key) >= 0 ? property : serialize(property, transferables);
      }
      if (input instanceof Error) {
        properties.message = input.message;
      }
    } else if (transferables && (properties as any) === transferables[transferables.length - 1]) {
      throw new Error("statically serialized object won't survive transfer of $name property");
    }

    if (properties.$name) {
      throw new Error('$name property is reserved for worker serialization logic.');
    }
    if (name !== 'Object') {
      properties.$name = name;
    }

    return properties;
  }

  throw new Error(`can't serialize object of type ${typeof input}`);
}

export function deserialize(input: Serialized): unknown {
  if (
    input === null ||
    input === undefined ||
    typeof input === 'boolean' ||
    typeof input === 'number' ||
    typeof input === 'string' ||
    input instanceof Boolean ||
    input instanceof Number ||
    input instanceof String ||
    input instanceof Date ||
    input instanceof RegExp ||
    input instanceof Blob ||
    isArrayBuffer(input) ||
    isImageBitmap(input) ||
    ArrayBuffer.isView(input) ||
    input instanceof ImageData
  ) {
    return input;
  }

  if (Array.isArray(input)) {
    return input.map(deserialize);
  }

  if (typeof input === 'object') {
    const name = (input as any).$name || 'Object';
    if (!registry[name]) {
      throw new Error(`can't deserialize unregistered class ${name}`);
    }
    const { klass } = registry[name];
    if (!klass) {
      throw new Error(`can't deserialize unregistered class ${name}`);
    }

    if (klass.deserialize) {
      return klass.deserialize(input);
    }

    const result = Object.create(klass.prototype);

    for (const key of Object.keys(input)) {
      // eslint-disable-next-line no-continue
      if (key === '$name') continue;
      const value = (input as SerializedObject)[key];
      result[key] = registry[name].shallow.indexOf(key) >= 0 ? value : deserialize(value);
    }

    return result;
  }

  throw new Error(`can't deserialize object of type ${typeof input}`);
}
