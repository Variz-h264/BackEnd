const express = require('express');
const connection = require('../../connect');

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        let sql = 'SELECT * FROM setting';

        await connection.execute(sql, (err, result) => {
            if (err) {
                res.status(400).json({
                    status: false,
                    code: 400,
                    message : err.message
                });
                return;
            } else {
                res.status(200).json({
                    status: true,
                    code: 200,
                    data: result,
                    message: 'เรียกข้อมูลสำเร็จ'
                });
            }
        });
    } catch (err) {
        console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);

        res.status(500).json({
            status: false,
            code: 500,
            message: 'เกิดข้อผิดพลาดในการดึงข้อมูล'
        });
    }
});

router.post('/', async (req, res) => {
    try {
        const { title, step, subtitle, description, logo, meta_keys } = req.body
        let status = 'offline'
        let sql = "INSERT INTO setting (title, step , subtitle, description, logo, meta_keys, status) VALUES (?, ?, ?, ?, ?, ?, ?)"

        await connection.execute(sql, [title, step, subtitle, description, logo, meta_keys, status], (err, result) => {
            if(err) {
                res.status(400).json({
                    status: false,
                    code: 400,
                    message : err.message
                })
                return
            } else {
                res.status(201).json({
                    status: true,
                    code : 201,
                    data : result,
                    message : "เพิ่มข้อมูลสำเร็จ"
                })
            }
        })
    } catch(err) {
        console.error('เกิดข้อผิดพลาดในการเพิ่มข้อมูล:', err);

        res.status(500).json({
            status: false,
            code: 500,
            message: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูล'
        });
    }
})

router.get('/:id', async (req, res) => {
    try {
      const { id } = req.params;
      let sql = 'SELECT * FROM setting WHERE id = ?';
  
      await connection.execute(sql, [id], (err, result) => {
        if (err) {
            res.status(400).json({
                status: false,
                code: 400,
                message : err.message
            });

            return;
        } else if (result.length === 0) {
            res.status(404).json({
              status: false,
              code: 404,
              message: `ไม่พบข้อมูลที่ตรงกับ ID: ${id}`
            });

            return;
          } else {
            res.status(200).json({
                status: true,
                code: 200,
                data: result[0],
                message: `เรียกข้อมูลสำเร็จ ID: ${id}`
            });
          }
      });
    } catch (err) {
      console.error('เกิดข้อผิดพลาดในการดึงข้อมูล:', err);
  
      res.status(500).json({
        status: false,
        code: 500,
        message: `เกิดข้อผิดพลาดในการดึงข้อมูลของ ID: ${id}`
      });
    }
});
  

router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params
        const { title, step, subtitle, description, logo, meta_keys, status } = req.body
        let sql = "UPDATE setting SET title = ?, step = ?, subtitle = ?, description = ?, logo = ?, meta_keys = ?, status = ? WHERE id = ?"
    
        await connection.execute(sql, [title, step, subtitle, description, logo, meta_keys, status, id], (err, result) => {
            if(err) {
                res.status(400).json({
                    status: false,
                    code: 400,
                    message : err.message
                })
                return
            } else {
                res.status(200).json({
                    status: true,
                    code: 200,
                    data : result,
                    message : `แก้ไขข้อมูลสำเร็จ ID: ${id}`,
                })
            }
        })
    } catch(err) {
        console.error('คุณไม่ได้ส่งค่าที่จะแก้ไขมาเราเลยแก้ให้ไม่ได้:', err);

        res.status(500).json({
            status: false,
            code: 500,
            message: 'คุณไม่ได้ส่งค่าที่จะแก้ไขมาเราเลยแก้ให้ไม่ได้'
        });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params
        let sql = "DELETE FROM setting WHERE id = ?"
    
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