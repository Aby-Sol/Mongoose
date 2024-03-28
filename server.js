const express = require("express")
const mongoose = require("mongoose")
const dotenv = require("dotenv").config()
const User = require('./userSchema')
const app = express()

app.use(express.json())


//Connecting the server to the database
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('connected to database'))
.catch((err) => console.log('Database connection error ',err));


// Create and Save a Record of a Model
async function createUser(){
    const newPerson = new User ({
    name: "Salim",
    age:4, 
    favoriteFoods:["Panini","Pâtes"]})
    const result =await newPerson.save();
    console.log(result);
}
createUser();

//Create many people with model.create
    const arrayOfPeople = [
        {name: "Mary", age:49, favoriteFoods:["Jello", "dates","Chips"]},
        {name: "Mary", age: 23, favoriteFoods:["Spaghetti", "Lasagna"]},
        {name: "Sofiene", age:21, favoriteFoods:["Chicken", "Rice", "Salad"]},
        {name: "Abir", age:27, favoriteFoods:["Rice","Pizza with fries", "Salade","Fricassé"]},
        {name: "Nessrine", age: 28, favoriteFoods:["Pasta", "Rice", "Sea food", "Fries", "Fricassé"]},
        {name: "Sarah", age: 8, favoriteFoods:['Fricassé', "Cake", "fries", "Rice"]}
    ] 
    const createManyPeople= async (arrayOfPeople)=>{
        try {
            const createdPeople = await User.create(arrayOfPeople);
            console.log("People created successfully:", createdPeople);
        } catch (err) {
            console.error(err);
        }
    };
    createManyPeople(arrayOfPeople);

//    //Use model.find() to Search for a specific name
   const searchByName = async (Name) => {
    try{
        const People = await User.find({name: Name});
        console.log(`Here are all the people with the name, '${Name}':`, People );
        }
    catch (err){
        console.error(err)
    }
   }
   searchByName('Salim')


   //Use model.findOne() to Return a single matching document from your database

const searchByFood = async(Food)=>{
    console.log(Food)
    try {
        const person = (await User.findOne({favoriteFoods : {$in : [Food]}})).name;
        console.log(`the person who loves '${Food}', is:`, person);
        }
    catch (err){
        console.error(err);
    }}
   searchByFood('Panini');

   //Use model.findById to search the database by ID

const searchById = async (_id) =>{
    try {
        const person = (await User.findById({_id : _id})).name;
        console.log(`The person with this id (${_id}) is:`, person)
    }
    catch (err){
        console.error(err)
    }
}
   searchById('660508f036b498cfbde8ddcf')

//Perform Classic Updates by Running Find, Edit, then Save

const UpdateFood = async (_id) =>{
    try {
        const findPerson = await User.findById(_id);
        findPerson.favoriteFoods.push('Hamburger');
        const UpdatePerson = await findPerson.save(); //Saving the update
        console.log("Favorite foods updated successfully", UpdatePerson);
        }
    catch (err){
        console.error(err)
    }
}
UpdateFood('660508f036b498cfbde8ddcf')

//Perform New Updates on a Document Using model.findOneAndUpdate()

const findPersonUpdateAge = async (Name) => {
    try {
        const person = await User.findOneAndUpdate({name : Name},{$set: {age:20}}, {new: true});
        console.log(`The age of ${Name} has been successfully updated to 20` )
        }
    catch (err) {
        console.error(err);
    }
}
findPersonUpdateAge('Sarah')

//Delete one document Using model.findByIdAndRemove

const deletePerson = async (_id) =>{
    try{
        const person = (await User.findByIdAndDelete({_id})).name;
        console.log(`${person} has been deleted successfully`);
        }
    catch (err) {
        console.error(err);
    }
}
    deletePerson('66051a25bdd827d73aa82570')

// //Delete many documents using model.deleteMany

const deleteMany = async (Name) =>{
    try {
        const deletedPeople = await User.deleteMany({name : Name});
        console.log(`People with the name ${Name} have been deleted successfully`)
        }
    catch {
        console.error(err)
    }
}
 deleteMany('Mary')

 //Chain Search Query Helpers to Narrow Search Results

 const chainMethods = async (Food) =>{
   const list =( User.find({favoriteFoods: Food})
    .sort({name : 1})    // sort ascending by name
    .limit(2)  // limit to 2 items
    .select("-age") // Hide The Ages
    .exec())    // execute the query
    .then(() =>{
        console.log('Query chain completed, here is the list', list)
    })
    .catch (err =>{
        console.error(err)
    })
}
chainMethods('Rice');