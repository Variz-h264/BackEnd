const connection = require("../service/connect");

function checkAuthorization(req, res, next) {
  const apiKey = req.headers["x-api-key"];

  try {
    const sql = "SELECT apiKey, status FROM api_keys WHERE apiKey = ?";
    connection.query(sql, [apiKey], (error, results) => {
      if (error) {
        console.error("Error executing SQL:", error);
        res.status(500).json({
          status: false,
          code: 500,
          message: "เซิฟเวอร์ขัดข้อง กรุณาแจ้งผู้ดูแล!!!",
        });
        return;
      }

      if (results.length > 0) {
        const key = results[0].apiKey;
        const status = results[0].status;

        if (status === "online") {
          next(); // ผ่านการอนุญาต
        } else {
          res.status(401).json({
            status: false,
            code: 401,
            message: "API KEY ของคุณยังไม่ได้รับการยืนยัน โปรดรอ 5-30 นาที ต้องขออภัยในความล่าช้า",
          });
        }
      } else {
        res.status(401).json({
          status: false,
          code: 401,
          message: "API KEY นี้ไม่มีในระบบ โปรดติดต่อผู้ดูแล!!!",
        });
      }
    });
  } catch (err) {
    console.error("เราตรวจเจอข้อผิดพลาดในการเช็ค API KEY:", err);

    res.status(500).json({
      status: false,
      code: 500,
      message: "กรุณาติดต่อผู้แล API!!!",
    });
  }
}

module.exports = {
  checkAuthorization,
};
