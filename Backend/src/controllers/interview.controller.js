const { PDFParse } = require("pdf-parse")

const {
    generateInterviewReport,
    generateResumePdf
} = require("../services/ai.service")

const interviewReportModel = require("../models/interviewReport.model")



/**
 * Generate interview report
 */
async function generateInterViewReportController(req, res) {

    try {

        if (!req.file) {

            return res.status(400).json({
                message: "Resume PDF is required"
            })

        }


        const parser = new PDFParse(
            Uint8Array.from(req.file.buffer)
        )


        const resumeContent = await parser.getText()



        const {
            selfDescription,
            jobDescription
        } = req.body



        const interViewReportByAi =
            await generateInterviewReport({

                resume: resumeContent.text,

                selfDescription,

                jobDescription

            })




        const interviewReport =
            await interviewReportModel.create({

                user: req.user.id,

                resume: resumeContent.text,

                selfDescription,

                jobDescription,

                ...interViewReportByAi

            })




        return res.status(201).json({

            message: "Interview report generated successfully.",

            interviewReport

        })



    } catch (error) {


        console.log(error)


        return res.status(500).json({

            message: "Failed to generate interview report",

            error: error.message

        })

    }

}






/**
 * Get report by id
 */
async function getInterviewReportByIdController(req,res){


    try{


        const { interviewId } = req.params



        const interviewReport =
            await interviewReportModel.findOne({

                _id: interviewId,

                user:req.user.id

            })



        if(!interviewReport){

            return res.status(404).json({

                message:"Interview report not found."

            })

        }



        res.status(200).json({

            message:"Interview report fetched successfully.",

            interviewReport

        })



    }
    catch(error){

        res.status(500).json({

            message:error.message

        })

    }

}







/**
 * Get all reports
 */
async function getAllInterviewReportsController(req,res){


    try{


        const interviewReports =
            await interviewReportModel
            .find({
                user:req.user.id
            })
            .sort({
                createdAt:-1
            })
            .select(
                "-resume -selfDescription -jobDescription -__v"
            )



        res.status(200).json({

            message:"Interview reports fetched successfully.",

            interviewReports

        })


    }
    catch(error){


        res.status(500).json({

            message:error.message

        })


    }

}








/**
 * Generate resume PDF
 */
async function generateResumePdfController(req,res){


    try{


        const {
            interviewReportId
        } = req.params



        const interviewReport =
            await interviewReportModel.findById(
                interviewReportId
            )



        if(!interviewReport){

            return res.status(404).json({

                message:"Interview report not found."

            })

        }



        const {

            resume,

            jobDescription,

            selfDescription

        } = interviewReport





        const pdfBuffer =
            await generateResumePdf({

                resume,

                jobDescription,

                selfDescription

            })




        res.set({

            "Content-Type":
            "application/pdf",


            "Content-Disposition":
            `attachment; filename=resume_${interviewReportId}.pdf`

        })



        res.send(pdfBuffer)



    }
    catch(error){


        res.status(500).json({

            message:error.message

        })


    }

}







module.exports = {

    generateInterViewReportController,

    getInterviewReportByIdController,

    getAllInterviewReportsController,

    generateResumePdfController

}