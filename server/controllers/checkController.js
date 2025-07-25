export const checkBackend = async (req, res) => {
    try {
        res.status(200).json({ message: "Backend Running" });
        console.log("Backend Running");
    } catch (error) {
        res.status(404).json({ message: "Backend error", error: error.message });
        console.log("Backend error:", error);
    }
};