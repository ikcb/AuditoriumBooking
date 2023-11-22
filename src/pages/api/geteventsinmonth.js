import clientPromise from "@/lib/database";

export default async function handler(req, res) {
    const client = await clientPromise;

    try {
        const db = client.db("auditorium");

        switch (req.method) {
            case "GET":
                const { month } = req.query;

                if (month && Number(month) >= 1 && Number(month) <= 12) {
                    const data = await db.collection("bookings").find({ month: Number(month) }).toArray();
                    res.status(200).json({ data });
                } else {
                    res.status(400).json({ error: "Please provide a valid month (1-12) in the query parameters." });
                }
                break;
            default:
                res.status(405).json({ error: "Method Not Allowed" });
                break;
        }
    } catch (error) {
        console.error("Error in API route:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}


function getRandomString(length) {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset.charAt(randomIndex);
    }
    return randomString;
}