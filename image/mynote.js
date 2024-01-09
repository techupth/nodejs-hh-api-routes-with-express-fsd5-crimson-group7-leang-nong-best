const limit = req.query.limit || 10; // กำหนดค่า default ในกรณีที่ไม่ได้ระบุ limit
const page = req.query.page || 1; // กำหนดค่า default ในกรณีที่ไม่ได้ระบุ page
const sort = req.query.sort || "asc"; // กำหนดค่า default ในกรณีที่ไม่ได้ระบุ sort

// ตรวจสอบค่า limit
if (limit > 100) {
  return res.status(401).json({
    message: "Invalid request, limit must not exceed 100 assignments.",
  });
}

// ตัวอย่างการใช้งาน sort ในการเรียงลำดับข้อมูล
let sortedData;

if (sort === "asc") {
  // เรียงข้อมูลจากน้อยไปหามาก
  sortedData = yourData.sort((a, b) => a.propertyToSort - b.propertyToSort);
} else if (sort === "desc") {
  // เรียงข้อมูลจากมากไปหาน้อย
  sortedData = yourData.sort((a, b) => b.propertyToSort - a.propertyToSort);
} else {
  // ค่า sort ไม่ถูกต้อง
  return res.status(400).json({
    message: "Invalid sort parameter. Use 'asc' or 'desc'.",
  });
}

// ตัดข้อมูลตาม limit และ page
const startIndex = (page - 1) * limit;
const endIndex = page * limit;
const slicedData = sortedData.slice(startIndex, endIndex);

// ส่งข้อมูลที่ถูกเรียงลำดับและตัดหน้าไปยัง client
return res.json(slicedData);
