import { dirname, join, resolve, sep } from 'path';
import { baseParse } from '@vue/compiler-core';
import fs from 'fs-extra';

const FenceDemoTag = 'vue:demo';
const DemoTag = 'sfc-playground';

const scriptRE = /<\/script>/;
const scriptLangTsRE = /<\s*script[^>]*\blang=['"]ts['"][^>]*/;
const scriptSetupRE = /<\s*script[^>]*\bsetup\b[^>]*/;
const scriptClientRE = /<\s*script[^>]*\bclient\b[^>]*/;
let index = 1;
function getDemoComponent(md: any, env: any, { title, desc, path, code, enableIntersectionObserver, ...props }: any) {
  const componentName = `DemoComponent${index++}`;
  path = normalizePath(path);
  injectImportStatement(env, componentName, path);
  const highlightedCode = md.options.highlight(code, props.lang || 'vue', '');
  let importMap = JSON.stringify({});

  try {
    importMap = JSON.stringify(env.frontmatter.importMap);
  } catch (e) {
    //
  }

  return `
    <${DemoTag}
      code="${encodeURIComponent(code)}"
      highlightedCode="${encodeURIComponent(highlightedCode)}"
      src="${path}"
      title="${title ?? ''}"
      desc="${desc ?? ''}"
      enableIntersectionObserver="${enableIntersectionObserver ?? 'true'}"
      importMap="${encodeURIComponent(importMap)}"
    >
      <${componentName}></${componentName}>
    </${DemoTag}>
  `.trim();
}

let fenceIndex = 1;
function genDemoByCode(md: any, env: any, path: string, code: string) {
  let demoName = '';
  let demoPath = '';
  // eslint-disable-next-line no-constant-condition
  while (true) {
    demoName = `demo-${fenceIndex++}.vue`;
    demoPath = join(dirname(path), demoName);
    if (!fs.existsSync(demoPath)) {
      break;
    }
  }
  fs.createFileSync(demoPath);
  fs.writeFileSync(demoPath, code);
  return getDemoComponent(md, env, {
    path: demoPath,
    code,
  });
}

function injectImportStatement(env: any, componentName: string, path: string) {
  const componentRegistStatement = `import ${componentName} from '${path}'`.trim();

  if (!env?.sfcBlocks?.scripts) {
    env.sfcBlocks.scripts = [];
  }
  const tags = env.sfcBlocks.scripts as { content: string }[];

  const isUsingTS = tags.findIndex((tag) => scriptLangTsRE.test(tag.content)) > -1;
  const existingSetupScriptIndex = tags?.findIndex(
    (tag) => scriptRE.test(tag.content) && scriptSetupRE.test(tag.content) && !scriptClientRE.test(tag.content),
  );

  if (existingSetupScriptIndex > -1) {
    const tagSrc = tags[existingSetupScriptIndex];
    tags[existingSetupScriptIndex].content = tagSrc.content.replace(
      scriptRE,
      `${componentRegistStatement}

      </script>`,
    );
  } else {
    tags.unshift({
      content: `
        <script ${isUsingTS ? 'lang="ts"' : ''} setup >
          ${componentRegistStatement}
        </script>
      `.trim(),
    });
  }
}

function normalizePath(path: string) {
  return path.split(sep).join('/');
}

function demoBlockPlugin(md: any) {
  const addRenderRule = (type: string) => {
    const defaultRender = md.renderer.rules[type];

    md.renderer.rules[type] = (tokens: any, idx: string, options: any, env: any, ...args: any[]) => {
      const token = tokens[idx];
      const content = token.content.trim();
      if (!content.startsWith(`<${DemoTag} `)) {
        return defaultRender(tokens, idx, options, env, ...args);
      }

      const { path } = env;

      const props = parseProps(content);
      if (!props.src) {
        console.error(`miss src props in ${path} demo.`);
        return defaultRender(tokens, idx, options, env, ...args);
      }

      const frontmatter = env.frontmatter;

      const mdDir = dirname(frontmatter.realPath ?? path);
      const srcPath = resolve(mdDir, props.src);
      const code = fs.readFileSync(srcPath, 'utf-8');
      return getDemoComponent(md, env, {
        ...props,
        title: props.title,
        desc: props.desc,
        path: srcPath,
        enableIntersectionObserver: props.enableIntersectionObserver,
        code,
      });
    };
  };

  addRenderRule('html_block');
  addRenderRule('html_inline');
}

function getPropsMap(attrs: any) {
  const map: any = {};
  // eslint-disable-next-line no-restricted-syntax
  for (const { name, value } of attrs) {
    map[name] = value?.content;
  }
  return map;
}

export function parseProps(content: string) {
  const ast = baseParse(content);
  const demoElement = ast.children[0] as any;

  return getPropsMap(demoElement.props as any[]);
}

function fencePlugin(md: any) {
  const defaultRender = md.renderer.rules.fence;
  md.renderer.rules.fence = (tokens: any, idx: number, options: any, env: any, ...args: any[]) => {
    const token = tokens[idx];
    if (token.info.trim() !== FenceDemoTag) {
      return defaultRender(tokens, idx, options, env, ...args);
    }
    const content = token.content;
    const path = env.path;
    return genDemoByCode(md, env, path, content);
  };
}

export function applyPlugins(md: any) {
  md.use(fencePlugin);
  md.use(demoBlockPlugin);
}
