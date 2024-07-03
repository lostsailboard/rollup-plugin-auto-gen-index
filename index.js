import fs from 'fs';
import path from 'path';

function getAllTsFiles(directory) {
    let tsFiles = [];

    function findTsFiles(dir) {
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                findTsFiles(fullPath);
            } else if (stat.isFile() && file.endsWith('.ts') && file !== 'Index.ts') {
                tsFiles.push(fullPath);
            }
        }
    }

    findTsFiles(directory);
    return tsFiles;
}

function auto_gen_index(directory) {
    return {
        name: 'auto-gen-index',
        buildStart() {
            const tsFiles = getAllTsFiles(directory);
            const exports = tsFiles.map(file => {
                const relativePath = path.relative(directory, file).replace(/\\/g, '/').replace(/\.ts$/, '');
                return `export * from './${relativePath}';`;
            }).join('\n');

            const indexPath = path.join(directory, 'Index.ts');
            fs.writeFileSync(indexPath, exports);
        }
    }
}

export default auto_gen_index;