import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
const PORT = 3000;
dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_KEY,
});
// console.log(process.env.OPEN_AI_KEY);
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());


app.get('/', async (req, res) => {
    res.status(200)
    res.send({
        message: 'hello from Ai'
    });
});

app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt:`${prompt}`,
            temperature: 0,
            max_tokens: 3000,
            top_p: 1,
            frequency_penalty: 0.5,
            presence_penalty: 0,
        });
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error){
        console.log(error)
        res.status(500).send({ error });
    }
});


app.listen(PORT, ()=> console.log(` Server listening on  http://localhost:${PORT}`));