import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Creatable } from 'react-select'
import 'whatwg-fetch'
import VirtualizedSelect from './VirtualizedSelect'
import DropdownOption from '../customComponents/DropdownOption.js'
import styles from './VirtualizedSelect.example.css'
// Load the full build.
var _ = require('lodash');

 



export default class VirtualizedSelectExample extends Component {
  static propTypes = {
    cityData: PropTypes.array.isRequired,
    countryData: PropTypes.array.isRequired,
    nameData: PropTypes.array.isRequired
  };
  constructor (props) {
    super(props)

    this.state = {
      openBrandGroupNames: [],
      selectedBrands: []
    }

    this.handleToggleBrandData = this.handleToggleBrandData.bind(this)
    this.nestedSelectOptions = this.nestedSelectOptions.bind(this)


  }

  

  // gets just the company names when page loads
  componentWillMount(){
    this.renderCompanyAndOpenBrandData();
  }
  
 // Render Company headers and brands if brands are open
  renderCompanyAndOpenBrandData() {
      
      let newOptions = [];

      this.props.brandData.forEach(company => {

        // Create header entry for the current brand group / company
        newOptions.push({
          type: 'header',
          name: company.groupName,
          code: ''
        });

        // If this brand group / company is currently open, then we should
        // render the brands immediately following it.
        if (this.isBrandGroupOpen(company.groupName)) {
          
          // add brand affinio report div
          newOptions.push({
            type: 'affinio',
            name: 'Brand',
            code: ''
          })

          company.brands.forEach(brand => {
             newOptions.push({
              type: 'country',
              name: brand.brandName,
              code: brand.countryCode,
              flagName: brand.countryName
            });
          });

        }
      })

      return newOptions;
  }


// Click on Company Name
  handleToggleBrandData(e, groupName){  
    this.setState({
      openBrandGroupNames: this.getToggledBrandGroup(groupName)
    })
   
  }  

// check if company name is in open brands state array 
// returns true or false
  isBrandGroupOpen(brandGroupName) {
    console.log('is open?', brandGroupName, this.state.openBrandGroupNames, this.state.openBrandGroupNames.includes(brandGroupName));
      return this.state.openBrandGroupNames.includes(brandGroupName);
    }

    /*  Returns a copy of the openBrandGroups object from this component's
      state with a specified brand*/
  getToggledBrandGroup(groupName) {
      if (this.isBrandGroupOpen(groupName)) {
        // If the brand group is open, then we want to remove it from the array
        // containing the names of open brand groups.
        return this.state.openBrandGroupNames.filter(aBrandGroupName => { return aBrandGroupName !== groupName; });
      } else {
        // If the brand group is NOT open, then we want to add it to the
        // array containing the names of open brand groups.
        return [...this.state.openBrandGroupNames, groupName];
      }
    }

 
// Click (select) a brand
// this function intally took the selected brand from a click and set the selected brand state to the value of the clicked selected brand
  handleOnChange(selectedBrand){
      
      //console.log('selectedBrand', selectedBrand);
      // split the selectedBrand string into an array 
      let selectedBrands = selectedBrand.split(',').map((value)=>{
        // remove whitespace
        return value.trim();
      }).filter((value) => {
          return !!value;
      });
      //console.log('selectedBrands', selectedBrands);
      // this will be the open group names to be rendered
      let openBrandGroupNames = [];
      
      // keep names from rendering an error when a brand is displayed and the company is closed | error is still occuring 
      if (selectedBrands.length) {

        openBrandGroupNames = selectedBrands.map((brandName)=> {

          const company = this.props.brandData.find((company)=> {

              const brand = company.brands.find((brand) => {
                return brand.brandName === brandName;
              });
              return !!brand;
          });
          // issue #1 | delete last brand causes error: company undefined
          return company.groupName;

        });
      } 
    
    // issue #3 | choose brand the close company, brand dissappears from searchbar
      this.setState({ 
        selectedBrands: selectedBrands,
        openBrandGroupNames: Array.from(new Set(openBrandGroupNames))
      });

    }


// Search 
  searchBrandDataOnInputChange(searchString) {

    let brandData = this.props.brandData;
    let openBrandGroupNames = [].concat(this.state.openBrandGroupNames);
     
    // brand we are looking for     
    searchString = searchString.toLowerCase().trim();

    if (searchString) {

      openBrandGroupNames = brandData.filter((company) => {

          // check if search is in a companies name
          const groupMatches = company.groupName.toLowerCase().indexOf(searchString) !== -1;
          // check if search is in the brands of a company OR is already selected   
          const brands = company.brands.filter((brand) => {

              return brand.brandName.toLowerCase().indexOf(searchString) !== -1 || this.state.selectedBrands.includes(brand.brandName);
          }); 
          // if the search was in either the company name or brand return true 
            if (groupMatches || brands.length > 0) {
              return true;
          }
          return false;
        }).map(company => company.groupName);
    }

      

      this.setState({
              openBrandGroupNames: Array.from(new Set(openBrandGroupNames)),
        });
    }

// functions I was trying to make close companies when search bar is empty
  areBrandsSelected(){
    // console.log('selectedBrands', this.state.selectedBrands)

    // console.log('#3openBrandGroupNames', this.state.openBrandGroupNames)
        if (!this.state.selectedBrand) {
        //console.log('there are NO brands selected')
/*        this.setState({
            openBrandGroupNames: []
        })*/
      } else if (!!this.state.selectedBrand) {
        //console.log('there are brands selected')
      }
  }
/*
  emptyOpenBrandGroupNames() {
    if (this.state.selectedBrands === [] && e.value === ''){
      this.setState({
        openBrandGroupNames: []
      })
    }

  }*/

   /*///////////////////////////////////////////////////////*/
   /*  CUSTOM OPTION RENDER for Maniplate Data NOT Style!   */
   /*///////////////////////////////////////////////////////*/
  nestedSelectOptions({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, optionIndex, options, selectValue, style, valueArray }) {
      const classNames = [styles.nameOption]

      if (option.type === 'header') {
        /*//////////////////////////////////////*/
        /*////////// COMPANY NAME //////////////*/
        /*//////////////////////////////////////*/
        classNames.push(styles.nameHeader)
        let groupName = option.name;
        return (
          <div
            onClick={(e)=> this.handleToggleBrandData(e, groupName)}
            className={classNames.join(' ')}
            key={key}
            style={style}
            id = {option.index}
          >
            {groupName} 
          </div>
        )
      } else if (option.type === 'affinio' ){
        /*//////////////////////////////////////*/
        /*/GRAY 'AFFINIO' OPTION IN DROP DOWN //*/
        /*//////////////////////////////////////*/
        classNames.push(styles.affinio)
        let affinioClassNames = classNames.join(' ');

        let showBrands = (affinioClassNames + " " + option.group);
        let hideBrands = styles.hideBrands;
  
        return (
        
          <div
            key={key}
            className={showBrands}
            style={style}
          >
            {option.name}<span className={styles.affinioReport}> Affinio Report </span>
          </div>
        )

      } else {
          const flagImageUrl = `https://cdn.rawgit.com/hjnilsson/country-flags/9e827754/svg/${option.code.toLowerCase()}.svg`
          const classNames = [styles.countryOption];
          let showBrands = classNames.join(' ');
          let hideBrands = styles.hideBrands;
        /*//////////////////////////////////////*/
        /* SELECTABLE BRAND OPTIONS with IMAGES */
        /*//////////////////////////////////////*/
        if (option === focusedOption) {
          classNames.push(styles.nameOptionFocused)
        }
        if (valueArray && valueArray.indexOf(option) >= 0) {
          classNames.push(styles.nameOptionSelected)
        }
        return (

          <div
            id={key}
            className={showBrands}
            key={key}
            onClick={() => selectValue(option)}
            onMouseEnter={() => focusOption(option)}
            style={style}
          >
           {option.name}
               <div className={styles.flagName}> {option.flagName}
                     <img
                      className={styles.countryFlag}
                      src={flagImageUrl}
                    />
              </div>
          </div>
        )
      }

    }

  render () {
    const { brandData } = this.props
    const { selectedBrands } = this.state
    
    /*optionHeight={({ option }) => option.type === 'header' ? 35: 25}*/
    // optionRenderer={this.nestedSelectOptions}

      // #5 Deleting a search is the same as searching the first letter in the search. Whatever is the last remaing letter of a search even after deleted stays as the last search query. 
      // So if the last search is 'Turner' then when you delete it, it will behave as if you searched 'T' ans render those results. If I give it a condition to be blank if the input is empty it will clear when deleting 
      // all characters, but it wont add a option when selected
      // maybe add a condition to onChange? but need to fix issue #1 to test

      // console.log('state', this.state);
    return (
      <div>
     {/* {console.log('selectedBrand=====>', selectedBrand)}*/}
          <h4 className={styles.header}>
            Manipulate Data NOT Style!
          </h4>
          <VirtualizedSelect
            labelKey='name'
            
            onChange={(selectedBrand) => {this.handleOnChange(selectedBrand) }}
            
            onInputChange={(searchString) => {this.searchBrandDataOnInputChange(searchString)}}
            
            optionRenderer={this.nestedSelectOptions}
            optionHeight={({ option }) => option.type === 'header' ? 35: 25}
            options={this.renderCompanyAndOpenBrandData()}
            ref={(ref) => this._customOptionHeightsSelect = ref}
            searchable={true}
            simpleValue
            value={selectedBrands}
            valueKey='name'
            multi={true}
          />


      </div>
    )
  }







}
    




