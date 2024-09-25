const mongoose = require('mongoose');
const slugify = require('slugify');
const uniqueValidator = require('mongoose-unique-validator');
const { log } = require('console');

const JobSchema = mongoose.Schema({
    slug: { 
        type: String, 
        lowercase: true, 
        unique: true 
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    images: [],
    img: {
        type: String,
        required: true
    },
    id_cat: { 
        type: String,
        required: true
    },
    company_name: {  
        type: String,
        required: true
    },
    published_at: {  
        type: Date,
        default: Date.now
    },
    location: {  
        type: String,
        required: true
    },
    requirements: { 
        type: String,
        required: true 
    }
});


JobSchema.plugin(uniqueValidator, { msg: "already taken" }); 

JobSchema.pre('validate',  async function (next) { 
    if (!this.slug) {
        console.log('dentro del if');
        await this.slugify();
    }
    console.log(this.slug);  
    next();
});

JobSchema.methods.slugify = async function () { 
    this.slug = slugify(this.name) + '-' + (Math.random() * Math.pow(36, 10) | 0).toString(36);
};

JobSchema.methods.toJobResponse = async function  (user) { 

    if (user !== null) {
        // return "hay usuario"
        return {
            slug: this.slug,
            name : this.name,
            price: this.price,
            description: this.description,
            id_cat : this.id_cat,
            img : this.img,
            images: this.images,
            company_name: this.company_name,    
            published_at: this.published_at,    
            location: this.location,
            requirements: this.requirements
        }
    } else {
        // return "no hay usuario"
        return {
            slug: this.slug,
            name : this.name,
            price: this.price,
            description: this.description,
            id_cat : this.id_cat,
            img : this.img,
            images: this.images,
            company_name: this.company_name,    
            published_at: this.published_at,    
            location: this.location,
            requirements: this.requirements
            
        }
    }
}

module.exports = mongoose.model('Job', JobSchema); //