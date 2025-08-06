// Gerekli kütüphaneleri içe aktar
const { VertexAI } = require('@google-cloud/vertexai'); // VertexAI SDK'sını içe aktarıyoruz
const express = require('express');
const cors = require('cors');

const app = express();
const port = 5942;

// Uygulamanın JSON verilerini işlemesini sağla
app.use(express.json());
app.use(cors());

// Kimlik bilgilerini içeren dosyanın yolunu ayarla
process.env.GOOGLE_APPLICATION_CREDENTIALS = './credentials.json';

// Google Cloud proje bilgilerini ve model adını tanımla
const PROJECT_ID = 'dulcet-glyph-468013-g8';
const LOCATION = 'us-central1';
const MODEL_NAME = 'gemini-2.0-flash-001'; // Kullanacağınız Gemini modelinin adı

// Vertex AI istemcisini başlat
const vertexAI = new VertexAI({ project: PROJECT_ID, location: LOCATION });

// GenerativeModel istemcisini oluştur
const generativeModel = vertexAI.getGenerativeModel({
    model: MODEL_NAME,
    generationConfig: {
        'maxOutputTokens': 8192, // Oluşturulan yanıtın maksimum token uzunluğu
        'temperature': 0, // Yanıtların ne kadar yaratıcı olacağını belirler (0-1)
        'topP': 0.95, // Yanıtları kısıtlamak için kullanılan bir parametre
    },
    safetySettings: [ // Güvenlik ayarları
        {
            'category': 'HARM_CATEGORY_HATE_SPEECH',
            'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
        },
        // Diğer güvenlik ayarlarını da ekleyebilirsiniz
    ],
});

// Front-end'den gelecek istekleri karşılayacak API endpoint'i
app.post('/ask-ai', async (req, res) => {
    const promptText = req.body.prompt;
    if (!promptText) {
        return res.status(400).send({ error: 'Lütfen bir prompt (istek) girin.' });
    }

    try {
        const request = {
            contents: [{ role: 'user', parts: [{ text: promptText }] }],
        };
        
        // Yapay zeka modeline istek gönder ve yanıtı al
        const response = await generativeModel.generateContent(request);

        // Yanıtın metin kısmını alıyoruz
        const generatedText = response.response.candidates[0].content.parts[0].text;
        
        // Yanıtı doğru formatta ön uca gönderiyoruz
        res.status(200).send({ blocklyCode: generatedText });

    } catch (error) {
        console.error('Yapay zeka çağrısında bir hata oluştu:', error);
        res.status(500).send({ error: 'Yapay zeka ile iletişim kurarken bir hata oluştu. Lütfen konsolu kontrol edin.' });
    }
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Sunucu http://localhost:${port} adresinde çalışıyor.`);
});