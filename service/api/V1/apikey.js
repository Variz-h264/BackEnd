const express = require('express');
const connection = require('../../connect');
const { generateApiKey } = require('../../../Middleware/generateApiKey');

const router = express.Router();

router.get('/', (req, res) => {
    const sql = 'SELECT * FROM api_keys';
    connection.query(sql, (err, result) => {
      if (err) {
        console.error('เกิดข้อผิดพลาดในการดึง API Key:', err);
        res.status(500).json({
          status: false,
          code: 500,
          message: 'เกิดข้อผิดพลาดในการดึง API Key',
        });
      } else {
        res.status(200).json({
          status: true,
          code: 200,
          data: result,
          message: 'ดึง API Key จากฐานข้อมูลสำเร็จ',
        });
      }
    });
});

router.post('/genApiKey', async (req, res) => {
    try {
        const apiKey = generateApiKey(32);
        const { name, website, ip } = req.body

        const sql = 'INSERT INTO api_keys (name, website, ip, apiKey, created_at) VALUES (?,?,?,?,NOW())';
        await connection.execute(sql, [name, website, ip, apiKey], (err, result) => {
          if (err) {
            console.error('เกิดข้อผิดพลาดในการบันทึก API Key:', err);
            res.status(400).json({
              status: false,
              code: 400,
              message: 'เกิดข้อผิดพลาดในการสร้าง API Key',
            });
          } else {
            res.status(200).json({
              status: true,
              code: 200,
              apiKey: result,
              message: 'API Key ถูกสร้างและบันทึกลงในฐานข้อมูลเรียบร้อยแล้ว',
            });
          }
        });
    } catch(err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);

        res.status(500).json({
            status: false,
            code: 500,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        });
    }
});

router.put('/:id', async (req, res) => {
  try {
      const { id } = req.params;
      const { name, website, ip, status } = req.body;
      const sql = 'UPDATE api_keys SET name = ?, website = ?, ip = ?, status = ? WHERE id = ?';
      const params = [name || null, website || null, ip || null, status || null, id];

       connection.execute(sql, params, (err, result) => {
        if (err) {
          console.error('เกิดข้อผิดพลาดในการบันทึก API Key:', err);
          res.status(400).json({
            status: false,
            code: 400,
            message: 'เกิดข้อผิดพลาดในการแก้ไข API Key',
          })
          return;
        } else {
          res.status(200).json({
            status: true,
            code: 200,
            result,
            message: 'API Key ถูกแก้ไขและบันทึกลงในฐานข้อมูลเรียบร้อยแล้ว',
          });
        }
      });
  } catch(err) {
      console.error('เกิดข้อผิดพลาดในการแก้ไขข้อมูล:', err);

      res.status(500).json({
          status: false,
          code: 500,
          message: 'เกิดข้อผิดพลาดในการแก้ไขข้อมูล'
      });
  }
});


router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        let sql = "DELETE FROM api_keys WHERE id = ?"
    
        await connection.execute(sql, [id], (err, result) => {
            if(err) {
                res.status(400).json({
                    status: false,
                    code: 400,
                    message : err.message
                })
                return
            } else {
                res.status(202).json({
                    status: true,
                    code: 202,
                    data : result,
                    message : `ลบข้อมูลสำเร็จ ID: ${id}`
                })
            }
        })
    } catch(err) {
         console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);

        res.status(500).json({
            status: false,
            code: 500,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        });
    }
})

module.exports = router;