const mongoose = require('mongoose')
const validator = require('validator')
const slugify = require('slugify')
const geoCoder = require('../utils/geocoder')
const jobSchema =  new mongoose.Schema({
    title:{
        type: String,
        required: [true, 'Please enter a job title'],
        trim: true,
        maxlength:[100,'Job title can not exceed 100 characters.']
    },
    slug: String,
    description: {
        type:String,
        required: [true, 'Please eneter job description'],
        maxlength:[100,'Job description cannot exceed 100 characters.']
    },
    email:{
        type:String,
        validate:[validator.isEmail, 'Please add a valid email address.']
    },
    address:{
        type:String,
        required: [true,'Please add an address.']
    },
    location :{
        type : {
            type : String,
            enum : ['Point']
        },
        coordinates : {
            type : [Number],
            index : '2dsphere'
        },
        formattedAddress : String,
        city : String,
        state : String,
        zipcode : String,
        country : String
    },
    company:{
        type:String,
        required:[true,'Please add Company Name.']
    },
    industry:{
        type:[String],
        required:true,
        enum:{
            values:[
                'Business',
                'Information Technology',
                'Banking',
                'Education/Training',
                'Telecommunication',
                'Others'
            ],
            message:'Please select correct options for Industry.'
        }
    },
    jobType:{
        type:String,
        required:true,
        enum:{
            values:[
                 'Permanent',
                 'Temporary',
                 'Internship'
            ],
            message:'Please select correct options for job types.'
        }
    },
    minEducation:{
        type:String,
        required:true,
        enum:{
            values:[
                'Bachelors',
                'Masters',
                'Phd'
            ],
            message:'Please select correct option for education.'
        }
    },
    positions:{
        type:Number,
        default:1
    },
    experience : {
        type : String,
        required : [true, 'Please enter experience required for this job.'],
        enum : {
            values : [
                'No Experience',
                '1 Year - 2 Years',
                '2 Year - 5 Years',
                '5 Years+'
            ],
            message : 'Please select correct options for Experience.'
        }
    },
    salary:{
        type:Number,
        required:[true,'Please provide expected salary']
    },
    postingdate:{
        type:Date,
        default:Date.now
    },
    lastdate:{
        type:Date,
        default:new Date().setDate(new Date().getDate()+7)
    },
    applicantsApplied:{
        type:[Object],
        select:false
    }
})

//Creating Job Slug before Saving
jobSchema.pre('save',function(next){
    //Creating slug before saving to DB
    this.slug=slugify(this.title,{lower:true})
    next()
})

//Setting up Location
jobSchema.pre('save', async function(next) {
    const loc = await geoCoder.geocode(this.address);

    this.location = {
        type : 'Point',
        coordinates : [loc[0].longitude, loc[0].latitude],
        formattedAddress : loc[0].formattedAddress,
        city : loc[0].city,
        state : loc[0].stateCode,
        zipcode : loc[0].zipcode,
        country : loc[0].countryCode
    }
});;

module.exports = mongoose.model('Job',jobSchema)