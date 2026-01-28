// const mysql = require("mysql2/promise");

// const { logAction } = require("./backend/utils/audit.util");

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     database: process.env.DB_DATABASE,
//     password: process.env.DB_PASSWORD,

//     port: process.env.DB_PORT || 3306,
//     queueLimit: 0,
//     waitForConnections: true,
//     connectionLimit: 10,
//     charset: "utf8mb4",
//     timezone: "+00:00"
// });

// db_connection = async() => {
//     try {
//         db = await pool.getConnection();
//         console.log("DB connection successful");
//         connection.release();
//     } catch (error) {
//         console.error("DB connection failed");
//     }
// }

// db_connection();

// module.exports = {
//     pool
// };



// const registerUser = async(email,password) => {
//     const[existing] = await db.execute(
//         "SELECT * FROM USERS WHERE email= ?",[email]
//     );

//     if(existing.length>0)
//     {
//         const error = new Error("Email already existing");
//         error.status = 409;
//         throw error;
//     }

//     hashedPassword = await bcrypt.hash(password,10);

//     await db.execute(
//         "INSERT INTO users(email, password, role, must_change_password, onboarding_status) Values(?, ?, 'user', FALSE, 'ACTIVE')",
//         [email,hashedPassword]
//     );
// };

// const loginUser = async(email, password) => {
//     const[rows] = await db.execute(
//         `SELECT FROM users where email = ?`
//         [email]
//     );

//     if(rows.length==0){
//         const error = new Error("Invalid Credentials");
//         error.status = 401;
//         throw error;
//     }

//     const user = rows[0];

//     if(!user.is_active)
//     {
//         const error = new Error("Account is blocked");
//         error.status = 403;
//         throw error;
//     }

//     if(user.lock_until && new Date(user.lock_until)> new Date())
//     {
//         const error = new Error("Due to multiple tries the account has been blocked and will open after 30 mins");
//         error.status = 423;
//         throw error;
//     }

//     checkPassword = bcrypt.compare(user.password, password);
    
//     if(!checkPassword)
//     {
//         const attempts = user.failed_attemps+1;

//         if(attemps>= Max_attemps)
//         {
//             await db.execute(
//                 `UPDATE users
//                 SET failed_attempts = ?, 
//                 lock_until = DATE_ADD(NOW(), INTERVAL ? MINUTE)
//                 WHERE id = ?`,
//                 [attempts, LOCK_TIME_MINUTES, user.id]
//             );
//             const error = new Error("Invalid Credentials");
//             error.status = 401;
//             throw error;
//         }

//         await db.execute(
//             `UPDATE users SET failed_attempts =? where id = ?`, [attempts, user.id]
//         );
//     }

//     await db.execute(
//         `UPDATE users SET failed_attempts = 0, lock_until = NULL where id = ? `, [user.id]
//     );

//     if(user.must_change_password){
//         return {
//             forcePasswordChange: true,
//             id: user.id,
//             email: user.email,
//             role: user.role
//         };
//     }
//     return{
//         id: user.id,
//         email: user.email,
//         role: user.role
//     };
// };

// module.exports = {
//     loginUser,
//     registerUser
// }

// const signUp = async (req, res, err) => {

//     try {
        
//         const{email, password} = req.body;
    
//         const user = await authService.RegisterUser(email, password);
    
//         await logAction(null, "SIGNUP", null);
    
//         response.success(res, "User Successfully registered");
//     } catch (error) {
//         next(error);
//     }
// }

// const login = async (req, res, err) => {
//     try {
//         const{email, password} = req.body;
//         if(user.forcePasswordChange){
//             await logAction(user.id, "LOGIN_PASSWORD_CHANGE_REQUIRED", null);

//             const onboardingToken = jwt.sign(
//                 {
//                     id: user.id,
//                     role: user.role,
//                     must_change_password: true,
//                 },
//                 process.env.JWT_SECRET,
//                 {expiresIn: "15m"}
//             );

//             return response.success(res,"Password change required", {
//                 forcePasswordChange: true,
//                 token: onboardingToken
//             });
//         }

//         await logAction(user.if,"Login_successfull", null);

//         const token = jwt.sign(
//             {
//                 id:user.id,
//                 role: user.role
//             },
//             process.env.JWT_SECRET,
//             {expiresIn: "1h"}
//         );

//         return response.success(res, "LoginSuccess", {
//             token,
//             user: {
//                 id: user.id,
//                 email: user.email,
//                 role: user.role
//             }
//         });
//     } catch (error) {
//         await logAction(null, "Login_Failed", null);
//         next(err);     
//     }
// };

// module.exports = {
//     signUp,
//     RegisterUser
// };


