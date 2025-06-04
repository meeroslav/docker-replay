import { readFileSync, writeFileSync } from 'fs';

const startTasksRegexp = /(async startTasks\(tasks, metadata\) \{\s*)([\s\S]*?)(\s*for \(const l of this\.lifeCycles\) \{)/;
const copyCommand = 'cp .nx/patches/life-cycle.js node_modules/nx/src/tasks-runner/life-cycle.js';

// load life-cycle.js
const lifeCycle = readFileSync('node_modules/nx/src/tasks-runner/life-cycle.js', { encoding: 'utf-8' });

const match = lifeCycle.match(startTasksRegexp);
if (match) {
  const originalContent = match[2];
  // Check if there's any console.log in the content between function start and for loop
  if (/console\.log/.test(originalContent)) {
    console.log('  ❌ Source file already patched. Skipping...');
    writeFileSync('.nx/patches/life-cycle.js', lifeCycle, { encoding: 'utf-8' });
  } else {
    // Replace the startTasks function to add console log at the beginning
    const patchedLifeCycle = lifeCycle.replace(startTasksRegexp, (match, functionStart, originalContent, forLoopStart) => {
      const hashLogCmd = 'tasks.forEach((t) => {\n      console.log({ id: t.id, name: t.name, target: t.target, hash: t.hash, hashDetails: t.hashDetails });\n    });\n    ';
      return functionStart + hashLogCmd + forLoopStart;
    });
    // save the patch to a file
    writeFileSync('.nx/patches/life-cycle.js', patchedLifeCycle, { encoding: 'utf-8' });
    writeFileSync('node_modules/nx/src/tasks-runner/life-cycle.js', patchedLifeCycle, { encoding: 'utf-8' });
    console.log('  ✅ Source file patched to track hash details');
  }
}

// Parse package.json and handle postinstall script
const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf-8' }));
if (packageJson.scripts && packageJson.scripts.postinstall) {
  // postinstall exists, check if it contains our copy command
  if (!packageJson.scripts.postinstall.includes(copyCommand)) {
    // Append our copy command to existing postinstall
    packageJson.scripts.postinstall = `${packageJson.scripts.postinstall} && ${copyCommand}`;
    writeFileSync('package.json', JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' });
    console.log('  ✅ Added copy command to existing postinstall script');
  } else {
    console.log('  ℹ️  Postinstall script already contains copy command');
  }
} else {
  // No postinstall exists, create it
  if (!packageJson.scripts) {
    packageJson.scripts = {};
  }
  packageJson.scripts.postinstall = copyCommand;
  writeFileSync('package.json', JSON.stringify(packageJson, null, 2), { encoding: 'utf-8' });
  console.log('  ✅ Created postinstall script with copy command');
}

// Add dimmed console log messages about requirements
console.log('\n  ⚠️  To see hash details, you need to run commands with:');
console.log('     1. Nx daemon switched off \x1b[2m(NX_DAEMON=false)\x1b[0m');
console.log('     2. Verbose logging enabled \x1b[2m(--verbose or NX_VERBOSE_LOGGING=true)\x1b[0m\n');



