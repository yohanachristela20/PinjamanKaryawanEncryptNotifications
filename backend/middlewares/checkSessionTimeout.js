import jwt from "jsonwebtoken";

const activeUsers = {};
const expiredUsers = new Set();
const checkSessionTimeout = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return forceLogout(res);
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const userId = decoded.id;
        const currentTime = Date.now();
        const userSession = activeUsers[userId];
        
        if (userSession) {
            const { lastActivity, heartbeatCount } = userSession;

            // Jika sudah tidak aktif lebih dari 5 menit atau heartbeatCount > 3
            // 300000 = 60000*5
            if (heartbeatCount > 5 || (currentTime - lastActivity) > 300000) {
                clearInterval(activeUsers[userId].heartbeatInterval);
                delete activeUsers[userId];
                expiredUsers.add(userId);
                console.log(`Sesi pengguna ${userId} telah dihapus.`);
                return res.status(401).json({ redirect: '/login', message: 'Sesi Anda telah berakhir. Silakan login kembali.' });
                // return forceLogout(res);

            }
            
        } else {
            activeUsers[userId] = {
                lastActivity: currentTime,
                heartbeatCount: 0,
                heartbeatInterval: setInterval(() => {
                    if (activeUsers[userId]) {
                        activeUsers[userId].heartbeatCount++;
                        console.log(`Heartbeat pengguna ${userId}: ${activeUsers[userId].heartbeatCount}`);
                    }
                }, 60000) // Setiap 1 menit
            };
        }
        next(); 
    } catch (error) {
        console.error("Token error: ", error.message);
        res.status(401).json({ message: 'Token tidak valid atau telah kedaluwarsa.' });
    }
};

export const clearUserSession = (userId, res) => {
    if (activeUsers[userId]) {
        clearInterval(activeUsers[userId].heartbeatInterval);
        delete activeUsers[userId];
        expiredUsers.add(userId);
        console.log(`Sesi pengguna ${userId} telah dihapus.`);
        if (res) forceLogout(res);
    }
};

// // Fungsi untuk paksa logout dengan header no-cache
const forceLogout = (res) => {
    res.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.header('Pragma', 'no-cache');
    res.header('Expires', '0');    
    return res.status(401).json({
        redirect: '/login',
        message: 'Sesi telah berakhir atau token tidak valid. Silakan login kembali.',
        clearToken: true,
    });
};


export default checkSessionTimeout;


