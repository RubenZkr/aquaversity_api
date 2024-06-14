

const testConnection = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS solution');
        res.json(rows);
    } catch (error) {
        console.error("Error fetching level:", error);
        res.status(500).send({ message: "Error fetching level" });
    }
}

module.exports = {
    testConnection
};