<h1 align="center">Student ID Card Generator API
</h1>

A Node.js API for generating customizable student ID cards with various templates and styles.

---

## Base URL

```
https://sicg.vercel.app
```

## Features

- 2 templates, 6 variants each
- Student Name
- College Name
- College Logo
- Student Photo
- Student ID
- Date of Birth
- Address
- Date of Issue
- Valid Until
- 130+ Country Supported
- Support for both GET and POST requests

## API Endpoints

### Health Check
```
GET /
```
Returns API information and available parameters.

### Generate ID Card
```
GET /generate
POST /generate
```

## Parameters

| Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| `name` | string | **Yes** | - | Student name |
| `dob` | string | No | `2001-01-25` | Date of birth (format: YYYY-MM-DD) |
| `id` | string | No | `1` | ID format (`1` = numeric like 123-456-7890, `2` = alphanumeric like ABC123456789) |
| `id_value` | string | No | Auto-generated | Custom student ID (overrides auto-generation) |
| `academicyear` | string | No | `2025-2028` | Academic year |
| `country` | number | No | `0` | Country index (see Country ID Table below) |
| `template` | string | No | `1` | Template selection (`1` or `2`) |
| `style` | string | No | `2` | Style variant (`1` to `6`) |
| `opacity` | number | No | `0.1` | Center logo watermark opacity (0.0 to 1.0) |
| `principal` | string | No | `Osama Aziz` | Principal/Authority signature name |
| `student_photo` | string (URL) | No | Default photo | Student photo URL |
| `college_logo` | string (URL) | No | Default logo | College logo URL |
| `issue_date` | string | No | `15 AUG 2025` | Card issue date |
| `issue_txt` | string | No | `Date Of Issue` | Issue date label |
| `exp_date` | string | No | `31 DEC 2025` | Card expiration date |
| `exp_txt` | string | No | `Card Expires` | Expiration label (only for template 1) |

## Country ID Table

Use the `country` parameter with the corresponding ID to select a university from a specific country:

| ID | Country | ID | Country | ID | Country |
|----|---------|----|---------|----|---------|
| 0 | Afghanistan | 46 | Guatemala | 92 | Peru |
| 1 | Albania | 47 | Guinea | 93 | Philippines |
| 2 | Algeria | 48 | Guyana | 94 | Poland |
| 3 | Argentina | 49 | Haiti | 95 | Portugal |
| 4 | Armenia | 50 | Honduras | 96 | Qatar |
| 5 | Australia | 51 | Hungary | 97 | Romania |
| 6 | Austria | 52 | Iceland | 98 | Russia |
| 7 | Azerbaijan | 53 | India | 99 | Saint Lucia |
| 8 | Bahamas | 54 | Indonesia | 100 | Samoa |
| 9 | Bahrain | 55 | Iran | 101 | San Marino |
| 10 | Bangladesh | 56 | Iraq | 102 | Saudi Arabia |
| 11 | Barbados | 57 | Ireland | 103 | Senegal |
| 12 | Belarus | 58 | Italy | 104 | Serbia |
| 13 | Belgium | 59 | Jamaica | 105 | Singapore |
| 14 | Bhutan | 60 | Japan | 106 | Somalia |
| 15 | Bolivia | 61 | Jordan | 107 | South Africa |
| 16 | Brazil | 62 | Kazakhstan | 108 | South Korea |
| 17 | Bulgaria | 63 | Kenya | 109 | South Sudan |
| 18 | Cambodia | 64 | Kosovo | 110 | Spain |
| 19 | Cameroon | 65 | Kuwait | 111 | Sri Lanka |
| 20 | Canada | 66 | Kyrgyzstan | 112 | Sudan |
| 21 | Central African Republic | 67 | Laos | 113 | Sweden |
| 22 | Chile | 68 | Latvia | 114 | Switzerland |
| 23 | China | 69 | Lebanon | 115 | Syria |
| 24 | Colombia | 70 | Liberia | 116 | Taiwan |
| 25 | Comoros | 71 | Libya | 117 | Tajikistan |
| 26 | Costa Rica | 72 | Lithuania | 118 | Tanzania |
| 27 | Côte d'Ivoire | 73 | Luxembourg | 119 | Thailand |
| 28 | Croatia | 74 | Madagascar | 120 | Togo |
| 29 | Denmark | 75 | Malaysia | 121 | Trinidad and Tobago |
| 30 | Dominica | 76 | Maldives | 122 | Tunisia |
| 31 | Dominican Republic | 77 | Mexico | 123 | Turkey |
| 32 | Ecuador | 78 | Monaco | 124 | Turkmenistan |
| 33 | Egypt | 79 | Mongolia | 125 | Uganda |
| 34 | El Salvador | 80 | Morocco | 126 | Ukraine |
| 35 | Eritrea | 81 | Myanmar | 127 | United Arab Emirates |
| 36 | Estonia | 82 | Namibia | 128 | United Kingdom |
| 37 | Ethiopia | 83 | Nepal | 129 | United States |
| 38 | Finland | 84 | Netherlands | 130 | Uruguay |
| 39 | France | 85 | New Zealand | 131 | Uzbekistan |
| 40 | Gambia | 86 | Nigeria | 132 | Vatican City |
| 41 | Georgia | 87 | North Korea | 133 | Venezuela |
| 42 | Germany | 88 | Norway | 134 | Vietnam |
| 43 | Ghana | 89 | Oman | 135 | Yemen |
| 44 | Greece | 90 | Pakistan | 136 | Zambia |
| 45 | Grenada | 91 | Panama | 137 | Zimbabwe |

## Usage Examples

### Example 1: Basic GET Request

Generate a simple ID card with minimal parameters:

```bash
curl "https://sicg.vercel.app/generate?name=John%20Doe"
```

### Example 2: GET Request with Multiple Parameters

```bash
curl "https://sicg.vercel.app/generate?name=Jane%20Smith&dob=2000-05-15&country=5&academicyear=2024-2027&template=2&style=3" --output student_card.png
```

### Example 3: POST Request (JSON)

```bash
curl -X POST https://sicg.vercel.app/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Alice Johnson",
    "dob": "1999-08-20",
    "country": 20,
    "academicyear": "2023-2026",
    "template": "1",
    "style": "4",
    "id": "2",
    "principal": "Dr. Smith",
    "issue_date": "01 SEP 2023",
    "exp_date": "31 AUG 2026"
  }' \
  --output alice_card.png
```

### Example 4: POST Request with Custom Images

```bash
curl -X POST https://sicg.vercel.app/generate \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bob Wilson",
    "student_photo": "https://example.com/photos/bob.jpg",
    "college_logo": "https://example.com/logos/university.png",
    "country": 129,
    "template": "2"
  }' \
  --output bob_card.png
```

### Example 5: JavaScript/Node.js

```javascript
const axios = require('axios');
const fs = require('fs');

async function generateIDCard() {
  const response = await axios({
    method: 'get',
    url: 'https://sicg.vercel.app/generate',
    params: {
      name: 'Sarah Connor',
      dob: '2001-12-25',
      country: 129,
      academicyear: '2024-2027',
      template: '1',
      style: '2'
    },
    responseType: 'arraybuffer'
  });
  
  fs.writeFileSync('student_card.png', response.data);
  console.log('ID card generated successfully!');
}

generateIDCard();
```

### Example 6: Python

```python
import requests

url = "https://sicg.vercel.app/generate"
params = {
    "name": "Michael Chen",
    "dob": "2002-03-10",
    "country": 23,
    "academicyear": "2025-2028",
    "template": "2",
    "style": "5"
}

response = requests.get(url, params=params)

if response.status_code == 200:
    with open("student_card.png", "wb") as f:
        f.write(response.content)
    print("ID card generated successfully!")
else:
    print(f"Error: {response.status_code}")
```

### Example 7: Direct Browser Access

Simply paste this URL in your browser:

```
https://sicg.vercel.app/generate?name=David%20Lee&country=60&template=1&style=3
```

The image will be displayed directly in the browser.

### Example 8: HTML Image Tag

```html
<img src="https://sicg.vercel.app/generate?name=Emma%20Brown&country=128&template=2&style=1" 
     alt="Student ID Card" 
     width="640" 
     height="402">
```

## Response

The API returns a PNG image with:
- **Content-Type:** `image/png`
- **Dimensions:** 1280x804 pixels
- The image is returned directly and can be saved or displayed

## Error Response

If required parameters are missing or an error occurs:

```json
{
  "error": "Name parameter is required"
}
```

or

```json
{
  "error": "Failed to generate ID card",
  "message": "Detailed error message"
}
```

## Template & Style Preview

- **Template 1:** Classic design with red accents
- **Template 2:** Modern design with shadow effects
- **Styles 1-6:** Different color schemes and layouts for each template

## Technical Details

- **Built with:** Node.js, Express.js, Canvas
- **Image Processing:** node-canvas library
- **Fonts:** Times, AlexBrush
- **Deployment:** Vercel

***

**API Version:** 1.0.2
**Last Updated:** October 2025
