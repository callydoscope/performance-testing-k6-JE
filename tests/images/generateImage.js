const Jimp = require('jimp');
const fs = require('fs');
const path = require('path');

// Configurações da imagem
const width = 732;
const height = 360;
const dirPath = path.join(__dirname, 'banner');  // Diretório 'banner'
const filePath = path.join(dirPath, 'tempBanner.png');

// Verifica se o diretório 'images' existe, se não existir, cria-o
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log('Diretório criado:', dirPath);
}

// Criação de uma nova imagem
new Jimp(width, height, '#FFFFFF', (err, image) => {
    if (err) throw err;

    // Carregar uma fonte
    Jimp.loadFont(Jimp.FONT_SANS_64_BLACK).then(font => {
        // Adicionar texto centralizado
        image.print(
            font,
            0,
            0,
            {
                text: 'Banner de Teste',
                alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
                alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
            },
            width,
            height
        );

        // Salvar a imagem no diretório 'images'
        image.write(filePath, (err) => {
            if (err) throw err;
            console.log('Arquivo de imagem criado com sucesso em:', filePath);
        });
    }).catch(err => {
        console.error('Erro ao carregar a fonte:', err);
    });
});
