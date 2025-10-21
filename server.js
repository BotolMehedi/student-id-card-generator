const express = require('express');
const { createCanvas, loadImage, registerFont } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load clg data
let colleges = {};
try {
    colleges = JSON.parse(fs.readFileSync(path.join(__dirname, 'public/collegeWa.json'), 'utf8'));
} catch (error) {
    console.error('Error loading college data:', error);
}

// hlper
async function loadImageFromSource(source) {
    if (source && source.startsWith('http')) {
        const response = await axios.get(source, { responseType: 'arraybuffer' });
        return await loadImage(Buffer.from(response.data));
    } else if (source) {
        return await loadImage(source);
    }
    return null;
}

// Generate function
function generateStudentId(format) {
    if (format === '1' || format === 1) {
        const part1 = Math.floor(Math.random() * 900 + 100);
        const part2 = Math.floor(Math.random() * 900 + 100);
        const part3 = Math.floor(Math.random() * 9000 + 1000);
        return `${part1}-${part2}-${part3}`;
    } else {
        const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        let result = '';
        for (let i = 0; i < 3; i++) {
            result += letters.charAt(Math.floor(Math.random() * letters.length));
        }
        for (let i = 0; i < 9; i++) {
            result += Math.floor(Math.random() * 10);
        }
        return result;
    }
}

// Format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Main gneration
async function generateCard(params, set) {
    const canvas = createCanvas(1280, 804);
    const ctx = canvas.getContext('2d');


    const styleIndex = parseInt(params.style || '2') - 1;
    const templates1 = ['public/temp1.png', 'public/temp2.png', 'public/temp3.png', 
                       'public/temp4.png', 'public/temp5.png', 'public/temp6.png'];
    const templates2 = ['public/temp2_1.png', 'public/temp2_2.png', 'public/temp2_3.png',
                       'public/temp2_4.png', 'public/temp2_5.png', 'public/temp2_6.png'];
    
    const templateSrc = set === 'set2' ? templates2[styleIndex] : templates1[styleIndex];

    // tmplates
    const templateImage = await loadImage(templateSrc);
    ctx.drawImage(templateImage, 0, 0, 1280, 804);

    // clg logo
    const logoSrc = params.college_logo || 'public/college_logo.png';
    const collegeLogo = await loadImageFromSource(logoSrc);
    
    if (collegeLogo) {
        if (set === 'set2') {
            ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
            ctx.shadowBlur = 4;
            ctx.shadowOffsetX = 2;
            ctx.shadowOffsetY = 2;
            ctx.drawImage(collegeLogo, 433, 177, 102, 102);
        } else {
            ctx.drawImage(collegeLogo, 15, 49, 165, 165);
        }
    }

    // stdnt pic
    const studentPhotoSrc = params.student_photo || 'public/default_student.png';
    const studentPhoto = await loadImageFromSource(studentPhotoSrc);
    
    if (studentPhoto) {
        const x = set === 'set2' ? 67 : 155;
        const y = set === 'set2' ? 179 : 227;
        const size = set === 'set2' ? 282 : 348;
        const radius = size / 2;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(studentPhoto, x, y, size, size);
        ctx.restore();
    }

    // center icon
    if (collegeLogo) {
        ctx.save();
        const opacity = parseFloat(params.opacity || '0.1');
        ctx.globalAlpha = opacity;
        const iconWidth = 620;
        const iconHeight = 620;
        const centerX = (canvas.width - iconWidth) / 2;
        const centerY = (canvas.height - iconHeight) / 2;
        ctx.drawImage(collegeLogo, centerX, centerY, iconWidth, iconHeight);
        ctx.restore();
    }

    // clg info
    const countryIndex = parseInt(params.country || '0');
    const countries = Object.keys(colleges);
    const selectedCountry = countries[countryIndex] || countries[0];
    const collegeData = colleges[selectedCountry] ? colleges[selectedCountry][0] : null;
    const collegeName = collegeData ? collegeData.name : 'Westminster International University in Tashkent';
    const address = collegeData ? collegeData.address : '628, Kanaikhali, Natore';

    // dob format
    const formattedDate = formatDate(params.dob || '2001-01-25');

    // Draw text based on tmplate
    if (set === 'set2') {
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 52px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.fillText((params.name || 'Mark Zuckerberg').toUpperCase(), 85, 750);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 40px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        
        ctx.fillText(formattedDate, 715, 428);
        
        const studentId = params.id_value || generateStudentId(params.id || '1');
        ctx.fillText(studentId, 715, 359);
        ctx.fillText(address.substring(0, 30), 715, 490);
        ctx.fillText(params.academicyear || '2025-2028', 715, 553);
        ctx.fillText(params.exp_date || '31 DEC 2025', 715, 620);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px Arial';
        ctx.fillText(params.issue_date || '15 AUG 2025', 1050, 80);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(params.issue_txt || 'Date Of Issue', 1005, 40);
    } else {
        ctx.fillStyle = '#F45245';
        ctx.font = 'bold 52px Arial';
        ctx.fillText((params.name || 'Mark Zuckerberg').toUpperCase(), 625, 402);
        
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 31px Arial';
        ctx.fillText(formattedDate, 808, 512);
        
        const studentId = params.id_value || generateStudentId(params.id || '1');
        ctx.fillText(studentId, 810, 462);
        ctx.fillText(address.substring(0, 30), 810, 557);
        
        ctx.fillStyle = '#F45245';
        ctx.font = 'bold 45px Arial';
        ctx.fillText(params.academicyear || '2025-2028', 665, 694);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 30px Arial';
        ctx.fillText(params.issue_date || '15 AUG 2025', 1050, 80);
        ctx.fillText(params.exp_date || '31 DEC 2025', 65, 785);
        
        ctx.fillStyle = '#FFFFFF';
        ctx.font = 'bold 40px Arial';
        ctx.fillText(params.issue_txt || 'Date Of Issue', 1005, 40);
        ctx.font = 'bold 34px Arial';
        ctx.fillText(params.exp_txt || 'Card Expires', 10, 745);
    }

    // clg name
    ctx.fillStyle = set === 'set2' ? '#FFFFFF' : '#000000';
    ctx.font = 'bold 32px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    const college = collegeName.toUpperCase();
    const words = college.split(' ');
    let line1 = '';
    let line2 = '';
    let line1Full = false;

    for (let word of words) {
        if (!line1Full) {
            const testLine = line1 ? line1 + ' ' + word : word;
            if (testLine.length <= 28) {
                line1 = testLine;
            } else {
                line1Full = true;
                line2 = word;
            }
        } else {
            line2 += (line2 ? ' ' : '') + word;
        }
    }

    const xOffset = set === 'set2' ? 380 : 0;
    const yOffset = set === 'set2' ? 110 : 0;

    if (!line2) {
        ctx.fillText(line1, 165 + xOffset, 130 + yOffset);
    } else {
        ctx.fillText(line1, 158 + xOffset, 112 + yOffset);
        const secondLineWords = line2.trim().split(' ');
        if (secondLineWords.length === 1) {
            ctx.fillText(line2, 300 + xOffset, 149 + yOffset);
        } else {
            ctx.fillText(line2, 200 + xOffset, 149 + yOffset);
        }
    }

    // Draw signature
    const signature = params.principal || 'Osama Aziz';
    ctx.font = 'italic 38px Arial';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    const sigX = set === 'set2' ? 955 : 1047;
    const sigY = set === 'set2' ? 700 : 693;
    ctx.fillText(signature, sigX, sigY);

    return canvas;
}

// API
app.all('/generate', async (req, res) => {
    try {
        const params = req.method === 'GET' ? req.query : req.body;

        if (!params.name) {
            return res.status(400).json({ error: 'Name parameter is required' });
        }


        const template = params.template || '1';
        const set = template === '2' ? 'set2' : 'set1';


        const canvas = await generateCard(params, set);


        res.setHeader('Content-Type', 'image/png');
        res.setHeader('Content-Disposition', 'inline; filename="student_id_card.png"');


        const buffer = canvas.toBuffer('image/png');
        res.send(buffer);

    } catch (error) {
        console.error('Error generating card:', error);
        res.status(500).json({ error: 'Failed to generate ID card', message: error.message });
    }
});

// Health
app.get('/', (req, res) => {
    res.json({
        message: 'Student ID Card Generator API',
        endpoints: {
            generate: '/generate (GET or POST)',
        },
        parameters: {
            name: 'required - Student name',
            dob: 'optional - Date of birth (default: 01/25/2001)',
            id: 'optional - ID format (1=numeric, 2=alphanumeric, default: 1)',
            academicyear: 'optional - Academic year (default: 2025-2028)',
            opacity: 'optional - Center icon opacity (default: 0.1)',
            country: 'optional - Country index (default: 0)',
            principal: 'optional - Principal name (default: Osama Aziz)',
            template: 'optional - Template (1 or 2, default: 1)',
            style: 'optional - Style (1 to 6, default: 2)',
            student_photo: 'optional - Student photo URL',
            college_logo: 'optional - College logo URL',
            issue_date: 'optional - Issue date (default: 15 AUG 2025)',
            issue_txt: 'optional - Issue text (default: Date Of Issue)',
            exp_date: 'optional - Expiry date (default: 31 DEC 2025)',
            exp_txt: 'optional - Expiry text (default: Card Expires)'
        }
    });
});

app.listen(PORT, () => {
    console.log(`Student ID Card Generator API running on port ${PORT}`);
});
