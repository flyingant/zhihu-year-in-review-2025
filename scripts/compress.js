const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// 配置路径
const INPUT_DIR = path.join(process.cwd(), 'raw-images/assets'); // 1. 这里放设计师给的原图，我没有上传到git，在gitignore排除了
const OUTPUT_DIR = path.join(process.cwd(), 'public/assets'); // 2. 压缩后输出到这里

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

const QUALITY = 80;

async function compressImages() {
  try {
    const files = fs.readdirSync(INPUT_DIR);

    for (const file of files) {
      const inputPath = path.join(INPUT_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file);
      const ext = path.extname(file).toLowerCase();

      if (['.jpg', '.jpeg'].includes(ext)) {
        await sharp(inputPath)
          .jpeg({
            quality: QUALITY,
            mozjpeg: true,
            chromaSubsampling: '4:4:4'
          })
          .toFile(outputPath);

        console.log(`✅ JPG 压缩完成: ${file}`);

      } else if (ext === '.png') {
        // === PNG 处理 ===
        await sharp(inputPath)
          .png({
            quality: QUALITY,
            palette: true,
            compressionLevel: 9,
            adaptiveFiltering: true
          })
          .toFile(outputPath);

        console.log(`✅ PNG 压缩完成: ${file}`);
      }
    }
    console.log('🎉 所有图片处理完毕！');

  } catch (error) {
    console.error('❌ 发生错误:', error);
    console.log('提示：请确保根目录下有 "raw-images" 文件夹，并且里面有图片。');
  }
}

compressImages();