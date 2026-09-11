#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync, mkdirSync, writeFileSync, readFileSync, cpSync, mkdtempSync, rmSync } from 'fs';
import { tmpdir } from 'os';
import { spawnSync } from 'child_process';
import { parseArgs } from 'node:util';
import inquirer from 'inquirer';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TEMPLATE_REPO = 'cloudinary-devs/create-cloudinary-next-template';
const SKILLS_REPO = 'https://github.com/cloudinary-devs/skills.git';

const TEMPLATES_DIR = join(__dirname, 'templates');
const LOCAL_SKILLS_DIR = join(TEMPLATES_DIR, 'skills');

const SUPPORTED_PACKAGE_MANAGERS = new Set(['npm', 'pnpm', 'yarn', 'bun']);
const GENERIC_AI_TOOLS = new Set(['cursor', 'copilot', 'generic']);
const ALL_SKILLS = ['cloudinary-next', 'cloudinary-docs', 'cloudinary-transformations'];

const link = (text, url) =>
  `\u001B]8;;${url}\u0007${text}\u001B]8;;\u0007`;

function pkgFromUserAgent(userAgent) {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  const [name, version = ''] = pkgSpec.split('/');
  if (!name) return undefined;
  return { name, version };
}

function detectPackageManager() {
  const pkg = pkgFromUserAgent(process.env.npm_config_user_agent);
  if (pkg && SUPPORTED_PACKAGE_MANAGERS.has(pkg.name)) {
    return pkg.name;
  }
  return 'npm';
}

function getRunDevCommand(packageManager) {
  switch (packageManager) {
    case 'yarn':
    case 'pnpm':
    case 'bun':
      return [packageManager, 'dev'];
    default:
      return ['npm', 'run', 'dev'];
  }
}

function runCommand(args, cwd) {
  const [command, ...cmdArgs] = args;
  const result = spawnSync(command, cmdArgs, { stdio: 'inherit', cwd, shell: false });
  if (result.error) {
    throw result.error;
  }
  if (result.status !== 0) {
    throw new Error(`Command failed: ${args.join(' ')}`);
  }
}

function isValidCloudName(name) {
  return /^[a-z0-9_-]+$/.test(name) && name.length > 0;
}

function isValidProjectName(name) {
  return /^[a-z0-9_-]+$/i.test(name) && name.length > 0;
}

function replaceTemplate(content, vars) {
  let result = content;
  Object.keys(vars).forEach((key) => {
    const regex = new RegExp(`\\{\\{${key}\\}\\}`, 'g');
    result = result.replace(regex, vars[key]);
  });
  return result;
}

function readTemplate(relativePath) {
  const templatePath = join(TEMPLATES_DIR, relativePath);
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${relativePath}`);
  }
  return readFileSync(templatePath, 'utf-8');
}

function findSkillSourceDir(baseDir, skillName) {
  const candidates = [join(baseDir, 'skills', skillName), join(baseDir, skillName)];
  return candidates.find((candidate) => existsSync(candidate));
}

function writeFileEnsureDir(filePath, content) {
  const fileDir = dirname(filePath);
  if (!existsSync(fileDir)) {
    mkdirSync(fileDir, { recursive: true });
  }
  writeFileSync(filePath, content);
}

function copySkillDir(sourceDir, targetRoot, skillName) {
  mkdirSync(targetRoot, { recursive: true });
  cpSync(sourceDir, join(targetRoot, skillName), { recursive: true });
}

function cloneSkillsRepo() {
  const tempDir = mkdtempSync(join(tmpdir(), 'cloudinary-skills-'));
  try {
    runCommand(['git', 'clone', '--depth', '1', SKILLS_REPO, tempDir], process.cwd());
    return tempDir;
  } catch (error) {
    rmSync(tempDir, { recursive: true, force: true });
    throw error;
  }
}

function writeEnvLocal(projectPath, templateVars, hasUploadPreset) {
  const raw = readTemplate('.env.local.template');
  const lines = raw.split('\n');
  const filtered = hasUploadPreset
    ? lines
    : lines.filter((line) => !line.includes('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'));
  const processed = replaceTemplate(filtered.join('\n'), templateVars);
  writeFileEnsureDir(join(projectPath, '.env.local'), processed);
}

function writeSkill(projectPath, aiTools) {
  if (!aiTools || aiTools.length === 0) return;

  const targetRoots = [];
  if (aiTools.includes('claude')) {
    targetRoots.push(join(projectPath, '.claude', 'skills'));
  }
  if (aiTools.some((tool) => GENERIC_AI_TOOLS.has(tool))) {
    targetRoots.push(join(projectPath, '.agents', 'skills'));
  }

  if (targetRoots.length === 0) return;

  const localFallbacks = {
    'cloudinary-next': join(LOCAL_SKILLS_DIR, 'cloudinary-next'),
    'cloudinary-docs': join(LOCAL_SKILLS_DIR, 'cloudinary-docs'),
    'cloudinary-transformations': join(LOCAL_SKILLS_DIR, 'cloudinary-transformations'),
  };

  let remoteRepoDir;
  let remoteInstallAvailable = false;

  try {
    remoteRepoDir = cloneSkillsRepo();
    remoteInstallAvailable = true;
  } catch (error) {
    console.log(chalk.yellow('  Remote Cloudinary skills install failed; using bundled local backups.'));
  }

  try {
    for (const targetRoot of targetRoots) {
      for (const skillName of ALL_SKILLS) {
        let sourceDir;

        if (remoteInstallAvailable) {
          sourceDir = findSkillSourceDir(remoteRepoDir, skillName);
        }

        if (!sourceDir) {
          sourceDir = localFallbacks[skillName];
        }

        if (!sourceDir || !existsSync(sourceDir)) {
          throw new Error(`Skill source not found for ${skillName}`);
        }

        copySkillDir(sourceDir, targetRoot, skillName);
      }
    }
  } finally {
    if (remoteRepoDir) {
      rmSync(remoteRepoDir, { recursive: true, force: true });
    }
  }
}

function writeMcpConfigs(projectPath, aiTools, templateVars) {
  if (!aiTools || aiTools.length === 0) return;
  if (!aiTools.includes('cursor') && !aiTools.includes('claude')) return;

  const mcp = replaceTemplate(readTemplate('.cursor/mcp.json.template'), templateVars);

  if (aiTools.includes('cursor')) {
    writeFileEnsureDir(join(projectPath, '.cursor', 'mcp.json'), mcp);
  }
  if (aiTools.includes('claude')) {
    writeFileEnsureDir(join(projectPath, '.mcp.json'), mcp);
  }
}

// No-op stub. The template repo is expected to ship a working next.config.js.
// <CldImage> serves through Cloudinary's CDN directly and does not require
// images.remotePatterns. This hook exists so future logic (e.g. enabling
// remotePatterns when the user opts into using next/image with Cloudinary
// sources) has an obvious home.
function patchNextConfigIfNeeded(_projectPath, _answers) {
  return;
}

function runCreateNextApp({ projectName, templateRepo, packageManager, installDeps }) {
  const args = [
    'create-next-app@latest',
    projectName,
    '--example',
    `https://github.com/${templateRepo}`,
  ];

  if (packageManager === 'pnpm') args.push('--use-pnpm');
  else if (packageManager === 'yarn') args.push('--use-yarn');
  else if (packageManager === 'bun') args.push('--use-bun');
  else args.push('--use-npm');

  if (!installDeps) args.push('--skip-install');

  args.push('--yes');

  runCommand(['npx', ...args], process.cwd());
}

function parseHeadlessArgs() {
  let values;
  try {
    ({ values } = parseArgs({
      args: process.argv.slice(2).filter((a) => a !== '--'),
      options: {
        headless: { type: 'boolean' },
        projectName: { type: 'string', default: 'my-cloudinary-next-app' },
        cloudName: { type: 'string' },
        hasUploadPreset: { type: 'boolean', default: false },
        uploadPreset: { type: 'string' },
        aiTools: { type: 'string', multiple: true, default: ['cursor'] },
        installDeps: { type: 'boolean', default: true },
        startDev: { type: 'boolean', default: false },
        packageManager: { type: 'string' },
        template: { type: 'string' },
      },
      allowPositionals: true,
    }));
  } catch (e) {
    console.error(chalk.red(`Error: ${e.message}`));
    process.exit(1);
  }

  const errors = [];

  if (!isValidProjectName(values.projectName)) {
    errors.push('--projectName can only contain letters, numbers, hyphens, and underscores');
  } else if (existsSync(values.projectName)) {
    errors.push(`Directory "${values.projectName}" already exists. Please choose a different name.`);
  }

  if (!values.cloudName) {
    errors.push('--cloudName is required');
  } else if (!isValidCloudName(values.cloudName)) {
    errors.push('--cloudName can only contain lowercase letters, numbers, hyphens, and underscores');
  }

  if (values.hasUploadPreset && !values.uploadPreset) {
    errors.push('--uploadPreset is required when --hasUploadPreset is set');
  }

  if (errors.length > 0) {
    for (const err of errors) {
      console.error(chalk.red(`Error: ${err}`));
    }
    process.exit(1);
  }

  return values;
}

async function promptInteractive() {
  console.log(chalk.cyan.bold('\nCloudinary Next.js Starter Kit\n'));
  console.log(
    chalk.gray(`Need a Cloudinary account? Sign up for free: ${link("https://cld.media/nextregister", "https://cld.media/nextregister")}\n`)
  );

  const questions = [
    {
      type: 'input',
      name: 'projectName',
      message: "What's your project's name?\n",
      default: 'my-cloudinary-next-app',
      validate: (input) => {
        if (!input.trim()) {
          return 'Project name cannot be empty';
        }
        if (!isValidProjectName(input)) {
          return 'Project name can only contain letters, numbers, hyphens, and underscores';
        }
        if (existsSync(input)) {
          return `Directory "${input}" already exists. Please choose a different name.`;
        }
        return true;
      },
    },
    {
      type: 'input',
      name: 'cloudName',
      message:
        "What's your Cloudinary cloud name?\n" +
        chalk.gray(` -> Find your cloud name: ${link("https://console.cloudinary.com/app/home/dashboard", "https://console.cloudinary.com/app/home/dashboard")}`) +
        '\n',
      validate: (input) => {
        if (!input.trim()) {
          return chalk.yellow(
            `Cloud name is required.\n` +
            ` -> Sign up: ${link('https://cld.media/nextregister', 'https://cld.media/nextregister')}\n` +
            ` -> Find your cloud name: ${link('https://console.cloudinary.com/app/home/dashboard', 'https://console.cloudinary.com/app/home/dashboard')}`
        );
        }
        if (!isValidCloudName(input)) {
          return 'Cloud name can only contain lowercase letters, numbers, hyphens, and underscores';
        }
        return true;
      },
    },
    {
      type: 'confirm',
      name: 'hasUploadPreset',
      message:
        'Do you have an unsigned upload preset?\n' +
        chalk.gray(' -> An unsigned upload preset allows users to upload files directly from your app.') +
        '\n' +
        chalk.gray(` -> Create one here: ${link("https://console.cloudinary.com/app/settings/upload/presets", "https://console.cloudinary.com/app/settings/upload/presets")}`) +
        '\n' +
        chalk.gray('    (Set signing mode to "Unsigned" when creating)\n'),
      default: false,
    },
    {
      type: 'input',
      name: 'uploadPreset',
      message: "What's your unsigned upload preset's name?\n",
      when: (answers) => answers.hasUploadPreset,
      validate: (input) => {
        if (!input.trim()) {
          return 'Upload preset name cannot be empty';
        }
        return true;
      },
    },
    {
      type: 'checkbox',
      name: 'aiTools',
      message:
        'Which AI coding assistant(s) are you using? (Select all that apply)\n' +
        chalk.gray(" We'll add local instruction files so your assistant knows Next.js + Cloudinary patterns.\n"),
      choices: [
        { name: 'Cursor', value: 'cursor' },
        { name: 'GitHub Copilot', value: 'copilot' },
        { name: 'Claude Code', value: 'claude' },
        { name: 'Other / Generic AI tools', value: 'generic' },
      ],
      default: ['cursor'],
    },
    {
      type: 'confirm',
      name: 'installDeps',
      message: 'Install dependencies now?\n',
      default: true,
    },
    {
      type: 'confirm',
      name: 'startDev',
      message: 'Start development server?\n',
      default: false,
      when: (answers) => answers.installDeps,
    },
  ];

  return inquirer.prompt(questions);
}

function resolvePackageManager(requested) {
  let pm = requested;
  if (pm && !SUPPORTED_PACKAGE_MANAGERS.has(pm)) {
    console.warn(
      chalk.yellow(
        `Unknown package manager "${pm}". Use npm, pnpm, yarn, or bun. ` +
          'Ignoring --packageManager; using npm_config_user_agent when it names a supported client, otherwise npm.'
      )
    );
    pm = undefined;
  }
  return pm || detectPackageManager();
}

function printSuccessBanner({ projectName, projectPath, aiTools, hasUploadPreset, devCmdStr, installCmdStr, dependenciesInstalled }) {
  const aiFilesCreated = aiTools && aiTools.length > 0;

  if (aiFilesCreated) {
    console.log(chalk.cyan('\nAI assistant skills installed:'));
    if (aiTools.includes('claude')) {
      console.log(chalk.gray('  - Claude Code: .claude/skills/cloudinary-next/, cloudinary-docs/, cloudinary-transformations/'));
    }
    if (aiTools.some((tool) => GENERIC_AI_TOOLS.has(tool))) {
      console.log(chalk.gray('  - Cursor / Copilot / Generic: .agents/skills/cloudinary-next/, cloudinary-docs/, cloudinary-transformations/'));
    }
    if (aiTools.includes('cursor')) console.log(chalk.gray('  - MCP (Cursor): .cursor/mcp.json'));
    if (aiTools.includes('claude')) console.log(chalk.gray('  - MCP (Claude Code): .mcp.json'));
    console.log(chalk.gray('\n  These skills teach your AI assistant about Next.js + Cloudinary patterns and best practices.'));
    console.log(chalk.gray('\n  How to use it:'));
    console.log(chalk.gray('    - Open your project in your AI assistant - the skill is already loaded'));
    console.log(chalk.gray('    - Ask your AI to help build Cloudinary features, and it will follow these patterns'));
    console.log(chalk.gray('    - Example prompts: "Add image upload", "Create a transformation gallery"\n'));
  }

  if (!hasUploadPreset) {
    console.log(chalk.yellow('\nNote: Upload preset not configured'));
    console.log(chalk.gray('  - Uploads require an unsigned upload preset'));
    console.log(chalk.cyan('\n  To enable uploads:'));
    console.log(chalk.cyan(`    1. Go to ${link("https://console.cloudinary.com/app/settings/upload/presets", "https://console.cloudinary.com/app/settings/upload/presets")}`));
    console.log(chalk.cyan('    2. Click "Add upload preset"'));
    console.log(chalk.cyan('    3. Set it to "Unsigned" mode'));
    console.log(chalk.cyan('    4. Add the preset name to your .env.local as NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET'));
    console.log(chalk.cyan('    5. Restart the dev server so Next.js picks up the new env var\n'));
  }

  console.log(chalk.cyan.bold('-'.repeat(60)));
  console.log(chalk.cyan.bold('Setup complete! Your Cloudinary Next.js app is ready.\n'));
  console.log(chalk.white(`Project location: ${projectPath}\n`));
  console.log(chalk.white('Next steps:'));
  if (dependenciesInstalled) {
    console.log(chalk.cyan(`  1. cd ${projectName}`));
    console.log(chalk.cyan(`  2. ${devCmdStr}`));
    console.log(chalk.gray('  3. Open your browser to the URL shown by the dev server\n'));
  } else {
    console.log(chalk.cyan(`  1. cd ${projectName}`));
    console.log(chalk.cyan(`  2. ${installCmdStr}`));
    console.log(chalk.cyan(`  3. ${devCmdStr}`));
    console.log(chalk.gray('  4. Open your browser to the URL shown by the dev server\n'));
  }
  console.log(chalk.white('What you can do now:'));
  console.log(chalk.gray('  - Explore the app and see how next-cloudinary components are wired up'));
  console.log(chalk.gray('  - Ask your AI assistant to add features using example prompts:\n'));
  console.log(chalk.green('    -> "Add an image gallery with transformations"'));
  console.log(chalk.green('    -> "Add a video player component"'));
  console.log(chalk.green('    -> "Implement signed uploads via a Server Action"\n'));
  console.log(chalk.cyan.bold('-'.repeat(60) + '\n'));
}

async function main() {
  let answers = {};
  let templateRepoOverride;

  if (process.argv.includes('--headless')) {
    const values = parseHeadlessArgs();
    Object.assign(answers, values);
    templateRepoOverride = values.template;
  } else {
    answers = await promptInteractive();
  }

  const { projectName, cloudName, uploadPreset, hasUploadPreset, aiTools, installDeps, startDev } = answers;

  const packageManager = resolvePackageManager(answers.packageManager);
  const templateRepo = templateRepoOverride || TEMPLATE_REPO;

  const templateVars = {
    PROJECT_NAME: projectName,
    CLOUD_NAME: cloudName,
    UPLOAD_PRESET: uploadPreset || '',
  };

  console.log(chalk.blue('\nScaffolding project with create-next-app...\n'));
  console.log(chalk.gray(`  template: ${templateRepo}`));
  console.log(chalk.gray(`  package manager: ${packageManager}\n`));

  try {
    runCreateNextApp({ projectName, templateRepo, packageManager, installDeps });
  } catch (error) {
    console.error(chalk.red('\nError running create-next-app:'), error.message);
    console.error(
      chalk.yellow(
        `\nIf the template repo (${templateRepo}) does not yet exist, set TEMPLATE_REPO in cli.js or pass --template <owner/repo>.`
      )
    );
    process.exit(1);
  }

  const projectPath = join(process.cwd(), projectName);

  console.log(chalk.blue('\nApplying Cloudinary configuration...\n'));

  writeEnvLocal(projectPath, templateVars, hasUploadPreset);
  writeSkill(projectPath, aiTools);
  writeMcpConfigs(projectPath, aiTools, templateVars);
  patchNextConfigIfNeeded(projectPath, answers);

  console.log(chalk.green('Cloudinary configuration applied.\n'));

  const devCmd = getRunDevCommand(packageManager);
  const installCmd = packageManager === 'yarn' ? ['yarn'] : [packageManager, 'install'];
  const devCmdStr = devCmd.join(' ');
  const installCmdStr = installCmd.join(' ');

  printSuccessBanner({
    projectName,
    projectPath,
    aiTools,
    hasUploadPreset,
    devCmdStr,
    installCmdStr,
    dependenciesInstalled: !!installDeps,
  });

  if (installDeps && startDev) {
    console.log(chalk.blue('Starting development server...\n'));
    try {
      runCommand(devCmd, projectPath);
    } catch (error) {
      console.error(chalk.red('\nError starting dev server:'), error.message);
      console.log(chalk.cyan(`\nYou can start it manually:`));
      console.log(chalk.cyan(`  cd ${projectName}`));
      console.log(chalk.cyan(`  ${devCmdStr}\n`));
    }
  }
}

main().catch((error) => {
  console.error(chalk.red('Error:'), error.message);
  process.exit(1);
});
