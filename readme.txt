
-if you deploy on runtime
(tsconfig.json)
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*.ts"],
}

- you can add on package.json if you running on runtime
(package.json)
 "scripts": {
    "build": "tsc",
    "start": "node dist/server.js"
  },
