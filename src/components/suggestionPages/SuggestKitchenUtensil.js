import React, { Component } from "react";
import TextField from "@mui/material/TextField";
// import Chip from "@mui/material/Chip";
import Autocomplete from "@mui/lab/Autocomplete"; // createFilterOptions,
// import axios from 'axios';
import axios from '../../util/Api';
import { Row, Col } from "react-bootstrap";
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import AddIcon from '@mui/icons-material/Add';
// import { Dialog, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
// import MealPageModal from "../mealsPage/MealPageModal";
import styles from "./suggestion.module.css";
import Popup1 from "../popups/popup1";


class SuggestKitchenUtensilForm extends Component {
  allMealNames = [];
  productNames = ["Spinach", "Brown Beans", "Ijebu Garri", "Honey Beans", "Kale", "Water",
    "Squash Potatoes", "Oregano", "Cashews", "Palm Oil", "Pineapple", "Onions", "Flour",
    "Butter", "Sugar", "Hawaiian Bread", "Avocados", "Tomatoes", "Beef", "Green Pepper",
    "Garlic", "Ginger", "Vegetable Oil", "Lemon", "Rosemary Powder"];
  productImageLink = [];
  categories = ["Baking", "Cooking", "Home", "Ethiopian", "Quick-Meal"];
  measurements = ["mL", "oz", "L", "cup(s)", "Tbsp", "tsp", "pt", "g", "kg", "lb", "qt",
    "gallon", "dash/pinch", "Leaves", "cloves", "cubes", "Large", "medium", "small"];
  kitchenUtensils = ["Baking Sheet", "Colander", "Cooking Oil", "Cutting Board",
    "Fridge", "Knife Set", "Mixing Bowls", "Pot", "Pan", "Peeler", "Thermometer",
    "Wire Mesh", "Zester"];

  ingredientsQuantityMeasurements = [];


  constructor() {
    super();
    this.state = {
      utensilName: "",
      utensilImage: "",
      utensilImageName: "",
      utensilImageData: "",
      utensilImagesData: [],
      intro: "",

      sizeNames: [],
      // do we need product group list AND strings ?
      descriptionGroupList: [],
      // store product names of inputted strings to compare with db products
      descriptionStrings: [],
      // do we want to use current ingredient formats ? Yes.
      currentIngredient: "",
      measurement: "",
      quantity: "",
      currentProductImgSrc: null,
      currentProductDisplayIndex: 0,

      currentStore: "",

      // we need to update how we create image paths
      productImg_path: "",
      new_product_description: [],
      suggested_stores: [],
      currProductIndexInDBsProductsList: -1,
      // currStoreIndexIfExistsInProductsList: -1,
      suggestedUtensils: [],

      instructionWordlength: 0,

      suggestedCategories: [],

      booleanOfDisplayOfDialogBoxConfirmation: false,

      //mealsModal controller
      openModal: false,
      stepInputs: []
    };

    this.closeModal = this.closeModal.bind(this);
    // this.handleStoreNameInput = this.handleStoreNameInput.bind(this);

    // this.getProductIndex = this.getProductIndex.bind(this);
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  componentDidMount() {

    // get all Meal Names***
    var url = "/get-meals";
    axios.get(url).then((body) => {
      var mealList = body.data;
      if (mealList && mealList.data.length !== 0) {
        console.log("returns GET of ALL MEALS ");
        for (var i = 0; i < mealList.data.length; i++) {
          this.allMealNames.push(mealList.data[i].mealName);
        }
      } else {
        console.log("get all meal names function does not return");
      }
    })
      .catch((err) => {
        console.log(err);
      });

    console.log(this.allMealNames);
    // get all store names*, if NEW products section exists.

    // can redux resolve this for us by checking if we recently called this in cache or from another page ??
    // var url = "/get-all-products";
    url = "https://chopchowdev.herokuapp.com/get-all-products";

    // axios.get(url).then((body) => {
    //   this.productsList = body.data;
    //   if (this.productsList && this.productsList.data.length !== 0) {
    //     console.log("returns GET ALL PRODUCTS ");
    //     for (var i = 0; i < this.productsList.data.length; i++) {
    //       this.productNames.push(this.productsList.data[i].product_name);
    //       this.productImageLink.push(this.productsList.data[i].product_image);
    //     }       
    //   } else {
    //     console.log("get all products function does not return");
    //   }
    // })
    // .catch((err) => {
    //   console.log(err);
    // });

    //----get category meals-------------------------
    url = "/get-all-categories";
    // axios.get(url).then((body) => {
    //   var categoriesFromDBList = body.data;
    //   if (categoriesFromDBList && categoriesFromDBList.data.length !== 0) {
    //     console.log("returns GET of ALL Categories ");

    //     for (var i = 0; i < categoriesFromDBList.data.length; i++) {
    //       this.categories.push(categoriesFromDBList.data[i].category_name);
    //     }
    //     console.log("PRINTING UPDATED CATEGORIES LIST");
    //   } else {
    //     console.log("get all products function does not return");
    //   }
    // })
    //   .catch((err) => {
    //     console.log(err);
    //   });
    this.categories = this.categories;

    let doc = document.querySelector('#formutensil')
    if (doc) {
      setInterval(() => {
        localStorage.setItem('suggestUtensilForm', JSON.stringify(this.state))

      }, 100)
    }

    if (localStorage.getItem('suggestUtensilForm')) {
      let {
        utensilName,
        intro,

        sizeNames,
        // do we need product group list AND strings ?
        descriptionGroupList,
        // store product names of inputted strings to compare with db products
        descriptionStrings,
        // do we want to use current ingredient formats ? Yes.
        currentIngredient,
        measurement,
        quantity,
        currentProductImgSrc,
        currentProductDisplayIndex,

        currentStore,

        // we need to update how we create image paths
        productImg_path,
        new_product_ingredients,
        suggested_stores,
        currProductIndexInDBsProductsList,
        // currStoreIndexIfExistsInProductsList,
        suggestedUtensils,

        suggestedCategories,

        booleanOfDisplayOfDialogBoxConfirmation
      } = JSON.parse(localStorage.getItem('suggestUtensilForm'))


      this.setState({
        utensilName,
        utensilImage: '',
        utensilImageName: '',
        utensilImageData: '',
        utensilImagesData: [],
        intro,

        sizeNames,
        // do we need product group list AND strings ?
        descriptionGroupList,
        // store product names of inputted strings to compare with db products
        descriptionStrings,
        // do we want to use current ingredient formats ? Yes.
        currentIngredient,
        measurement,
        quantity,
        currentProductImgSrc,
        currentProductDisplayIndex,

        currentStore,

        // we need to update how we create image paths
        productImg_path,
        new_product_ingredients,
        suggested_stores,
        currProductIndexInDBsProductsList,
        // currStoreIndexIfExistsInProductsList,
        suggestedUtensils,

        suggestedCategories,

        booleanOfDisplayOfDialogBoxConfirmation,
      })
    }
  }

  onInputChange = (e) => {
    console.log("Comes in on text field change; ");
    console.log(e.target.value)
    // console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ "utensilName": e.target.value });
  };

  uploadUtensilImage = () => {
    // <input accept="image/*,video/mp4,video/mov,video/x-m4v,video/*" id="utensilImage" name="utensilImage" type="file" className="mb-2 pr-4" onChange={(ev) => this.onUpdateutensilImage(ev)} />
    const input = document.createElement("input");
    input.accept = "image/*,video/mp4,video/x-m4v,video/*";
    input.id = "utensilImage";
    input.name = "utensilImage";
    input.type = "file";
    input.onchange = (ev) => this.onUpdateUtensilImage(ev);
    input.hidden = true;
    input.click()
  }

  onUpdateUtensilImage = (event) => {
    if (event.target.files[0] === undefined) return;
    // Allowing file type
    var allowedImageExtensions = /(\.jpg|\.jpeg|\.png|\.)$/i;

    if (allowedImageExtensions.exec(event.target.files[0].name)) {
      //display utensils main image or videoin suggest utensil
      if (this.state.utensilImage === '') {
        this.setState({
          utensilImage: event.target.files[0],
          utensilImageName: event.target.files[0].name,
          utensilImageData: URL.createObjectURL(event.target.files[0])
        });
        var image = document.getElementById("UtensilsMainImages");
        image.style.display = "block";
        image.src = URL.createObjectURL(event.target.files[0]);

        console.log(event.target.files[0]);
        console.log(event.target.files[0].name);


        console.log(allowedImageExtensions.exec(event.target.files[0].name));

        // console.log(URL.createObjectURL(event.target.files[0]));
      } else {
        this.setState({
          utensilImagesData: [...this.state.utensilImagesData, URL.createObjectURL(event.target.files[0])]
        });
        // var image = document.getElementById("UtensilsMainImages"+(this.state.utensilImagesData.length+1));
        // image.style.display = "block";
        // image.src = URL.createObjectURL(event.target.files[0]);

        console.log(event.target.files[0]);
        console.log(event.target.files[0].name);


        console.log(allowedImageExtensions.exec(event.target.files[0].name));

      }
    }
    else {
      alert("Invalid image type");
    }

  };

  onTextFieldChange = (e) => {
    console.log("Comes in on text field change; ");

    console.log(" " + [e.target.id] + " " + e.target.value);
    this.setState({ [e.target.id]: e.target.value });
  };

  handleCategoryDropdownChange = (val) => {
    console.log(this.state.suggestedCategories)
    this.setState({ suggestedCategories: val });
    // below setstate causes an error to make each new set a sum of all previous.
    // this.setState({ suggestedCategories: [...this.state.suggestedCategories, val] });

  }

  categoryBlur = (e) => {
    this.setState({
      categoryVal: e.target.value
    })
  }

  addCategory = () => {
    let cat = this.state.categoryVal;
    let suggestedCategories = this.state.suggestedCategories;
    suggestedCategories.push(cat);
    this.setState({
      suggestedCategories
    })
  }

  handleDeleteCategoryChip(chip) {
    var array = [...this.state.suggestedCategories]; // make a separate copy of the array
    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      this.setState({ suggestedCategories: array });
    }
  }

  handleMeasurement = (event, val) => {
    // if (event.target.value) {
    //   this.setState({ measurement: event.target.value });
    // } else {
    //   this.setState({ measurement: "" });
    // }

    console.log("In handleMeasurement . \n val is: " + val);

    if (val !== null && val !== undefined) {
      // CHECK IF INPUT MATCHES ANY PRODUCT ALREADY IN DB and
      // set currProductIndexInDBsProductsList variable 
      const searchResult = this.measurements.map(function callback(element) { if (element.toLowerCase() === (val.toLowerCase())) { return true; } else { return false; } });
      const tmpcurrMeasurementIndexInDBsMeasurementList = searchResult.indexOf(true);
      console.log("Curr Product Index If Exists In Products List is: \n" + tmpcurrMeasurementIndexInDBsMeasurementList);

      // check if product name is an existing product
      // set product existense to index, so one will not need to edit
      // this.setState({ currProductIndexInDBsProductsList: tmpcurrMeasurementIndexInDBsMeasurementList });

      // set current ingredient to input Product regardless
      // console.log("Event is: \n"+ event.target);
      if (event != null && event.target.value !== null) {
        this.setState({ measurement: event.target.innerHTML });

      } else {
        this.setState({ measurement: val });
      }
    }
    else {
      console.log('val is null!');
    }
  }

  addDescription = (event) => {
    event.preventDefault();
    var properDescriptionStringSyntax;
    var descriptionValue = document.getElementById("descriptionName").value;
    var quantityValue = document.getElementById("quantity").value;
    // best to get the measurement from the state
    // perhaps becuse inner html is defined before state is updated
    // var measurementValue = this.state.currentIngredientMeasurement;
    var measurementValue = document.getElementById("measurement").value;


    if (descriptionValue === "") { window.alert("Enter decription name"); return; }
    if (quantityValue === "") { window.alert("Enter quantity"); return; }
    // update ingredient string syntax for no quantity or no measurement.
    if (quantityValue === "") {
      properDescriptionStringSyntax = descriptionValue;
    } else if (measurementValue === "" && quantityValue !== "") {
      // MAKE sure we are using the right and tested variables to display the right type of string at all times.
      properDescriptionStringSyntax = "" + quantityValue + "-" + descriptionValue;
    } else {
      properDescriptionStringSyntax =
        "" + quantityValue + " " + measurementValue + "-" + descriptionValue;
    }
    console.log(properDescriptionStringSyntax);

    // This is the Object for an Ingredient of a Known Product
    var descriptionObject = {

      // display: this.state.currProductIndexInDBsProductsList,
      // availableLocations: [],
      measurement: measurementValue,
      properDescriptionStringSyntax: properDescriptionStringSyntax
    };

    // edit product details for new product object
    // descriptionObject.productImgFile = null;
    descriptionObject.productIndex = 0;
    // descriptionObject.calories = 0;

    // append String to new Products array if not
    // var tmpNewProducts = [...this.state.new_product_ingredients];
    // var tmpNewProducts = this.state.new_product_ingredients;
    // var updatedProductList = [tmpNewProducts, descriptionObject];

    // this.setState({ new_product_ingredients: updatedProductList })
    this.setState({ new_product_description: [...this.state.new_product_description, descriptionObject] });

    this.setState({ descriptionGroupList: [...this.state.descriptionGroupList, descriptionObject] });
    // after adding product to ingredient group list
    // reset current product img src and path to null, and same for current ingredient inputs
    // this.setState({ currentProductImgSrc: null, productImg_path: "" });
    this.setState({ quantity: '', measurement: "null" });
    this.setState({ measurement: "", descriptionName: "" });
    this.handleAddDescriptionChip(properDescriptionStringSyntax);

    //  Resetting inner html directly to clear ingredient inputs without changing state
    // document.getElementById("currentIngredient").value = 'NewPs';
    // document.getElementById("currentIngredientQuantity").value = 8;
    // document.getElementById("currentIngredientMeasurement").value = 'Removed';

  }

  handleAddDescriptionChip(chip) {
    this.setState({
      descriptionStrings: [...this.state.descriptionStrings, chip],
    });
  }

  handleDeleteSizeChip(chip) {
    var array = this.state.descriptionStrings; // make a separate copy of the array
    var removeFromGroup = this.state.descriptionGroupList;

    var index = array.indexOf(chip);
    if (index !== -1) {
      array.splice(index, 1);
      removeFromGroup.splice(index, 1);

      this.setState({ descriptionStrings: array, descriptionGroupList: removeFromGroup });
    }
  }

  closeModal() {
    this.setState({ openModal: false });
    // this.openModal = false;
    // this.func_removeutensilFlag();
  }

  openMealDetailsModal = (index) => {
    // toggle products page visibility for product to be Edited.
    // this.productDisplayBooleansOutOfState[this.state.ingredientGroupList.length] = false;
    // this.productDisplayBooleansOutOfState[index] = true;

    // var tmpIngredientGroupList = this.state.ingredientGroupList;
    // tmpIngredientGroupList[index].display = true;
    // tmpIngredientGroupList[currentProductDisplayIndex].display = false;
    // this.setState({ingredientGroupList: tmpIngredientGroupList});
    console.log("Comes in toggle product details div id. Index is : " + index);

    var individualProductDisplay = document.getElementById("ProductAdditionalDataDisplayed");
    console.log(individualProductDisplay);

    // if (individualProductDisplay.style.display === "block") {
    //   individualProductDisplay.style.display = "none";
    // }
    // else {
    //   individualProductDisplay.style.display = "block";
    // }
    this.setState({ openModal: true });
  }

  ///////////////////////////////////////////////////////////////////////////////////////
  render() {

    // const [ingredientInput, setIngredientInput] = useState('');    

    // const theme = createMuiTheme({
    //   palette: { primary: green },
    // });

    const { descriptionStrings } = this.state;

    return (
      <div className={styles.suggestion_section_2}>
        <form id="formutensil" className={styles.suggestion_forms} noValidate autoComplete="off" encType="multipart/form-data" method="post" >
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label htmlFor="utensilName" className={styles.suggestion_form_label}>
                Utensil Name
              </label>
              <TextField value={this.state.utensilName} id="utensilName" fullWidth onChange={this.onInputChange} variant="outlined" required />
            </div>

            <h3>Upload Utensil Images <em>(Up to 4)</em></h3>
            {this.state.utensilImagesData.length < 3 &&
              <div className={styles.suggestion_form_image}>
                <div className={styles.suggestion_form_image_col_1}>
                  <div onClick={() => this.uploadUtensilImage()} className={styles.suggestion_form_image_icon_con}>
                    <AddIcon className={styles.suggestion_form_image_icon} />
                  </div>
                </div>
                <div className={styles.suggestion_form_image_col_2}>
                  <p>Upload picture with : Jpeg or Png format and not more than 500kb</p>
                </div>
              </div>}

            <Row>
              <Col md={12} style={{ marginTop: "20px" }}>
                <p><img id="UtensilsMainImages" width="100%" alt="main_Utensil_Image" style={{ display: "none" }} />
                </p>
              </Col>
            </Row>

            {
              this.state.utensilImagesData.map((data, index) =>
                <Row key={index}>
                  <Col md={12} style={{ marginTop: "20px" }}>
                    <p><img id="UtensilsMainImages" src={data} width="100%" alt="main_Utensil_Image" />
                    </p>
                  </Col>
                </Row>
              )
            }

            <h3>Description</h3>
            <div className={styles.suggestion_form_group}>
              <label htmlFor="intro" className={styles.suggestion_form_label}>
                Intro (150 words)
              </label>
              <TextField value={this.state.intro} multiline id="intro" fullWidth onChange={this.onTextFieldChange} variant="outlined" />
            </div>
          </div>
          <h3>Utensil Descriptions</h3>
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label htmlFor="descriptionName" className={styles.suggestion_form_label}>
                Description Name
              </label>
              <TextField fullWidth id="descriptionName" onChange={this.onTextFieldChange}
                variant="outlined" value={this.state.descriptionName} />
            </div>
            <div className={styles.suggestion_form_2_col}>
              <div className={styles.suggestion_form_2_col_2}>
                <div className={styles.suggestion_form_group}>
                  <label htmlFor="quantity" className={styles.suggestion_form_label}>
                    Quantity
                  </label>
                  <TextField fullWidth id="quantity" type="number" onChange={this.onTextFieldChange}
                    variant="outlined" placeholder="1.." value={this.state.quantity} />
                </div>
              </div>

              <div className={styles.suggestion_form_2_col_1}>
                <div className={styles.suggestion_form_group}>
                  <label htmlFor="measurement" className={styles.suggestion_form_label}>
                    Measurement
                  </label>
                  <Autocomplete
                    id="measurement"
                    options={this.measurements.map((option) => option)}
                    value={this.state.measurement}
                    onChange={this.handleMeasurement}
                    freeSolo
                    renderInput={(params) => (<TextField {...params}
                      value={this.state.measurement} id="measurement"
                      variant="outlined" type="text" />)}
                  />
                </div>
              </div>

              <Button variant="contained" disableRipple onClick={this.addDescription} className={styles.ingredient_button} style={{ width: "max-content" }} > Add Size</Button>
            </div>

            <Stack direction="row" spacing={1} className={styles.stack}>
              {
                descriptionStrings.map((data, index) => (
                  <Chip
                    key={index}
                    label={data}
                    className={styles.chip}
                    onClick={() => this.handleDeleteSizeChip(data)}
                    onDelete={() => this.handleDeleteSizeChip(data)}
                  />
                ))
              }
            </Stack>

          </div>


          <h3>Utensil Categories</h3>
          <div className={styles.suggestion_form}>
            <div className={styles.suggestion_form_group}>
              <label htmlFor="tags-outlined" className={styles.suggestion_form_label}>
                Suggest category for this Utensil
              </label>
              <div className={styles.input_button}>
                <Autocomplete
                  multiple
                  id="tags-outlined"
                  freeSolo
                  clearOnBlur
                  onBlur={this.categoryBlur}
                  // filterSelectedOptions
                  options={this.categories.map((option) => option)}
                  // onChange={(ev,val)=>this.handleCategoryDropdownChange(ev,val)}
                  onChange={(e, newValue) => this.handleCategoryDropdownChange(newValue)}
                  // getOptionLabel={option => option}
                  // renderTags={() => {}}
                  value={this.state.suggestedCategories}
                  renderInput={params => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="Suggest categories for this utensil.."
                      fullWidth
                    />)}
                />
                <Button variant="contained" disableRipple onClick={this.addCategory} className={styles.ingredient_button} style={{ width: "max-content" }} > Add Category</Button>
              </div>

            </div>
            <Stack direction="row" spacing={1} className={styles.stack}>
              {
                this.state.suggestedCategories.map((data, index) => (
                  <Chip
                    key={index}
                    label={data}
                    className={styles.chip}
                    onClick={() => this.handleDeleteCategoryChip(data)}
                    onDelete={() => this.handleDeleteCategoryChip(data)}
                  />
                ))
              }
            </Stack>
          </div>

          <u style={{ color: "#F47900" }} onClick={this.openMealDetailsModal}> Show Preview</u>

          {/* <Row>
                <Col md={12}> */}
          {/* <ThemeProvider theme={theme}> */}
          <Button variant="contained" className={styles.ingredient_button} style={{ width: "100%" }} onClick={() => this.sendSuggestedMealToDB()}> Add Utensil</Button>
          {/* </ThemeProvider> */}
          {/* </Col>
                
              </Row> */}
          <u >View privacy policy</u>
          <div id="ProductAdditionalDataDisplayed" >
            <Popup1 popup='kitchen' openModal={this.state.openModal} closeModal={this.closeModal}
              name={this.state.utensilName} description={this.state.intro}
              imageData={this.state.utensilImageData} image={this.state.utensilImage}
              imagesData={this.state.utensilImagesData} categories={this.state.suggestedCategories}
              descriptionsList={this.state.descriptionStrings}
            />
            {/* <MealPageModal openModal={this.state.openModal} closeModal={this.closeModal}
                 mealName={this.state.mealName} mealImage={this.state.mealImage}
                 categories={this.state.suggestedCategories}
                  prepTime={this.state.prepTime} cookTime={this.state.cookTime}
                  serves={this.state.servings}
                  ingredientsList = {this.state.ingredientStrings} utensilsList={this.state.suggestedUtensils}
                  instructionChunk1={this.state.instructionChunk1} instructionChunk2={this.state.instructionChunk2}
                  instructionChunk3={this.state.instructionChunk3} instructionChunk4={this.state.instructionChunk4}
                  instructionChunk5={this.state.instructionChunk5} instructionChunk6={this.state.instructionChunk6}
                  chunk1Content={this.state.chunk1Content} chunk2Content={this.state.chunk2Content}
                  chunk3Content={this.state.chunk3Content} chunk4Content={this.state.chunk4Content}
                  chunk5Content={this.state.chunk5Content} chunk6Content={this.state.chunk6Content}
                  instructionWordlength={this.state.instructionWordlength}
                  tips={this.state.tips} mealImageData={this.state.mealImageData}
                 /> */}
          </div>
        </form>
      </div>
    );
  }
}

export default SuggestKitchenUtensilForm;