require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/lead', async (req, res) => {
  try {
    const { name, phone, email, query, source, page } = req.body;
    if (!phone && !email) return res.status(400).json({ error: 'Phone or email is required' });
    const BOT_API = process.env.BOT_API_URL || 'https://bot.ayusomamherbals.com/api/lead';
    await fetch(BOT_API, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, phone, email, query, source: source || 'website', page }) });
    res.json({ success: true, message: 'Lead received' });
  } catch (err) {
    console.error('Lead error:', err.message);
    res.json({ success: true, message: 'Lead received' });
  }
});

app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    if (!message) return res.status(400).json({ error: 'Message required' });
    res.json({ reply: generateChatResponse(message, history || []) });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.json({ reply: 'Abhi thoda problem aa raha hai. WhatsApp pe baat karein: +91 85951 60713' });
  }
});

function generateChatResponse(message, history) {
  const msg = message.toLowerCase().trim();
  if (/^(hi|hello|hey|namaste|namaskar)/.test(msg)) return 'Namaste! ðŸ™ Main Ayusomam ka Ayurvedic specialist hoon. Sinus se related koi bhi sawaal poochiye â€” main aapki madad karunga.';
  if (/program|kya karte|what do you|treatment|ilaj|ilaaj/.test(msg)) return 'Hum ek Ayurvedic sinus treatment program chalate hain jo root cause treat karta hai. Isme 4 cheezein hain:\n\n1. Ayurvedic Herbs â€” specially selected for nasal inflammation\n2. Breathing Exercises â€” sinus drainage improve karne ke liye\n3. Trigger Management â€” identify aur remove karo jo sinus trigger karta hai\n4. Diet Guidance â€” healing foods + foods to avoid\n\nDo programs hain: 7-day Starter (â‚¹499) aur 14-day Core (â‚¹1,299). Aap kitne time se sinus problem face kar rahe hain?';
  if (/price|pricing|cost|kitna|kitne|paisa|rupee|â‚¹|499|1299|rate/.test(msg)) return 'Do programs hain:\n\nâœ… 7-Day Starter â€” â‚¹499\nPehli baar try karne ke liye perfect. Herbal protocol + diet guide + WhatsApp support.\n\nâ­ 14-Day Core â€” â‚¹1,299 (Recommended)\nChronic sinus ke liye. Advanced herbs + breathing exercises + full diet plan + follow-up consultation.\n\nAgar aapko 1+ saal se sinus hai, 14-day program recommended hai. Free consultation chahiye?';
  if (/surgery|operation|doctor ne bola|ent|nasal polyp|polyps/.test(msg)) return 'Bahut se patients hamare paas aate hain jinke doctor ne surgery suggest ki hoti hai. Hamara Ayurvedic protocol naturally inflammation reduce karta hai â€” aur kai logon ko surgery ki zaroorat nahi padi.\n\nHar case alag hota hai, isliye pehle aapki condition properly assess karni hogi. Free consultation book karein.';
  if (/spray|otrivin|nasivion|xylometazoline|nasal spray|spray dependency|spray band/.test(msg)) return 'Nasal spray dependency ek bahut common problem hai. Spray sirf temporarily passages open karta hai â€” par rebound congestion hota hai.\n\nHamara program dheere dheere spray se chutkara dilata hai natural herbs aur breathing exercises ke through. Ek patient Shika Tyagi ji ko har 4-5 ghante spray lagana padta tha â€” ab bilkul naturally breathe karti hain.';
  if (/symptom|blocked|naak band|headache|sir dard|smell|saans|breathing|drip|sneezing/.test(msg)) return 'Common sinus symptoms mein aate hain:\n\nâ€¢ Naak band rehna ya bahna\nâ€¢ Sir mein dard ya bhaari pan\nâ€¢ Smell ya taste ka kam hona\nâ€¢ Raat ko saans lene mein dikkat\nâ€¢ Post-nasal drip\nâ€¢ Baar baar sneezing\n\nAgar yeh 3+ mahine se hain, chronic sinusitis ho sakta hai. Root cause treat karna zaroori hai.';
  if (/kitne (saal|mahine|din)|how long|kab se|duration|saal se/.test(msg)) return 'Treatment aapki sinus ki duration pe depend karta hai.\n\nâ€¢ 1 saal se kam â†’ 7-day Starter\nâ€¢ 1-3 saal â†’ 14-day Core recommended\nâ€¢ 3+ saal â†’ Definitely 14-day Core\n\nAap kitne time se sinus problem face kar rahe hain?';
  if (/medicine|dawa|tablet|antibiotic|steroid|montelukast|allegra|cetirizine|levocet/.test(msg)) return 'Zyada tar patients already medicines try kar chuke hote hain. Yeh sab temporary relief dete hain par root cause treat nahi karte.\n\nHamara protocol medicines ke saath parallel chal sakta hai. Dheere dheere jab natural healing hoti hai, medicines reduce ho jaati hain.';
  if (/how|kaise|process|kya karna|steps|shuru/.test(msg)) return 'Simple process hai:\n\n1ï¸âƒ£ Free Consultation â€” WhatsApp pe symptoms share karein\n2ï¸âƒ£ Personalized Plan â€” 24 ghante mein herb protocol + diet guide\n3ï¸âƒ£ Heal at Home â€” Daily follow karein + WhatsApp support\n\nSab ghar baithe hota hai. Koi clinic visit nahi.';
  if (/consult|book|appointment|baat|call|contact/.test(msg)) return 'Free consultation ke liye WhatsApp pe message karein:\n\nðŸ“± +91 85951 60713\n\nYa website pe form bhar dijiye â€” 2 ghante mein contact karenge. Bilkul free hai.';
  if (/result|kaam karta|work|effective|proof|review|success/.test(msg)) return 'Usually 5-10 din mein improvement feel hoti hai. Shika Tyagi ji ko spray dependency thi â€” ab naturally breathe karti hain. Rajesh ji ko raat ko neend nahi aati thi â€” 10 din mein normal sleep aane lagi.\n\nFree consultation mein aapka case discuss karenge.';
  if (/diet|khana|food|kya khaye|kya na khaye|avoid/.test(msg)) return 'Diet important hai:\n\nâœ… Haldi wala doodh, adrak, tulsi, shahad\nâœ… Warm soups, steamed veggies\n\nâŒ Cold drinks, ice cream\nâŒ Dairy (kuch logon mein mucus badhata hai)\nâŒ Fried aur processed food\n\nFull personalized diet plan program mein milta hai.';
  if (/refund|guarantee|money back|paisa wapas|trust/.test(msg)) return 'Hum "100% cure" claims nahi karte. Lekin agar 7 din mein improvement na ho, hum discuss karte hain. Free consultation bilkul risk-free hai â€” pehle samjhiye, phir decide kijiye.';
  if (/thank|shukriya|dhanyavad|thanks/.test(msg)) return 'Aapka shukriya! ðŸ™ Agar aur koi sawaal ho toh zaroor poochiye. WhatsApp: +91 85951 60713';
  return 'Main aapki madad karna chahunga. Aap pooch sakte hain:\n\nâ€¢ Programs ke baare mein\nâ€¢ Pricing jaanni hai\nâ€¢ Symptoms discuss karna hai\nâ€¢ Surgery avoid karna chahte hain\nâ€¢ Spray dependency se chutkara\n\nYa directly WhatsApp pe baat karein: +91 85951 60713';
}

app.get('/{*splat}', (req, res) => { res.sendFile(path.join(__dirname, 'public', 'index.html')); });
app.listen(PORT, () => { console.log(`Ayusomam Web running on port ${PORT}`); });
