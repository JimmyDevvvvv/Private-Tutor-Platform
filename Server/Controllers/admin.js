import tryCatch from "../MiddleWare/TryCatch.js";
import courses from "../Routes/Courses.js";
export const CreateCourse = tryCatch(async(req,res) =>{
    const {title,description,category,price,duration} = req.body

    const image = req.file

    await courses.create({
        title,
        description,
        category,
        image: image?.path,
        duration,
        price
    })
    res.status(201).json({
        message:"Course created successful"
    })
})


export const testAPI = tryCatch(async (req, res) => {
    res.status(200).json({
        message: "Test API is working!",
    });
});



























//  upload document


// upload mock exams







