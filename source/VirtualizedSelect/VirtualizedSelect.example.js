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
      options: [],
      openBrandGroupNames: [],
      selectedBrands: []
    }

    this.handleToggleBrandData = this.handleToggleBrandData.bind(this)
    this.manipulateDataNotStyleRenderer = this.manipulateDataNotStyleRenderer.bind(this)


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


      this.setState({
        options: newOptions
      },()=>{this.areBrandsSelected()});

  }


// Click on Company Name
  handleToggleBrandData(e, groupName){  

    
    this.setState({
      openBrandGroupNames: this.getToggledBrandGroup(groupName)
    },()=> {this.renderCompanyAndOpenBrandData()})
   
  }  
    // check if company name is in open brands state array 
    // returns true or false
      isBrandGroupOpen(brandGroupName) {
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
  handleOnChange(selectedBrand){
      
      // split the selectedBrand string into an array 
      let selectedBrands = selectedBrand.split(',').map((value)=>{
        // remove whitespace
        return value.trim();
      });
      // this will be the open group names to be rendered
      let openBrandGroupNames = [];
      
      // keep names from rendering an error when a brand is displayed and the company is closed
      if (selectedBrands.length) {
        openBrandGroupNames = selectedBrands.map((brandName)=> {

          const company = this.props.brandData.find((company)=> {

              const brand = company.brands.find((brand) => {
                return brand.brandName === brandName;
              });
              return !!brand;
          });
          // issue # 1 | delete last brand causes error: company undefined
          return company.groupName;

        });
      } 

      this.setState({ 
        selectedBrands: selectedBrands,
        openBrandGroupNames: Array.from(new Set(openBrandGroupNames))
      },()=> {
        this.areBrandsSelected()
      });

    }


// Search 
  searchBrandDataOnInputChange(e){
    let brandData = this.props.brandData;
     
    // brand we are looking for     
    const searchString = e.toLowerCase();

          // matches to search string by company name or brand name
          const results = brandData.filter((company) => {

              // check if search is in a companies name
              const groupMatches = company.groupName.toLowerCase().indexOf(searchString) !== -1;
              // check if search is in the brands of a company    
              const brands = company.brands.filter((brand) => {
                  return brand.brandName.toLowerCase().indexOf(searchString) !== -1;
              }); 
              // if the search was in either the company name or brand return true 
                if (groupMatches || brands.length > 0) {
                  return true;
              }
              return false;
            });

          

    //////
 
/*        let filteredResults = [];

        results.forEach((company, index)=> {
                filteredResults.push({
                  type: 'header',
                  name: company.groupName,
                  code: ''
                });

                  company.brands.forEach(brand => {
                   filteredResults.push({
                    type: 'country',
                    name: brand.brandName,
                    code: brand.countryCode,
                    flagName: brand.countryName
                  });
                });    
        });*/
    //////
      // issue #4 | Will not render company name if search does not include company name ( will only render brands ). Even if I render new options from here.

      console.log('results=====>', results)


     
      let resultsCompanyNames = results.map((company)=>{
            return company.groupName;
          });
      // fix for #2 : keep opened brands open when searching
      let openBrandsAndUserSearchResults = Array.from(new Set([...this.state.openBrandGroupNames, ...resultsCompanyNames]));
      // console.log('total of open brands in state and searched ======>',openBrandsAndUserSearchResults )
      


      let selectedBrands = results.map((company)=> {
        company.brands.map((brand)=>{
          return brand.brandName;
        })
      });
      

      //console.log('selectedBrands =====>',selectedBrands )
      this.setState({
              //options: filteredResults,
              selectedBrands: selectedBrands,
              openBrandGroupNames: openBrandsAndUserSearchResults,
        }, ()=>{this.renderCompanyAndOpenBrandData()});
    }

// this may be used to close all companies
  areBrandsSelected(){
    // issue #3 | choose brand the close company, brand dissappears from searchbar but stays in selected brand state | log and not is here so it runs after state is updated
    // console.log('selectedBrands', this.state.selectedBrands)

    //console.log('openBrandGroupNames', this.state.openBrandGroupNames)
        if (!this.state.selectedBrand) {
        //console.log('there are NO brands selected')
/*        this.setState({
            openBrandGroupNames: []
        })*/
      } else if (!!this.state.selectedBrand) {
        //console.log('there are brands selected')
      }
  }

   /*///////////////////////////////////////////////////////*/
   /*  CUSTOM OPTION RENDER for Maniplate Data NOT Style!   */
   /*///////////////////////////////////////////////////////*/
  manipulateDataNotStyleRenderer({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, optionIndex, options, selectValue, style, valueArray }) {
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
    // optionRenderer={this.manipulateDataNotStyleRenderer}

    return (
      <div>
     {/* {console.log('selectedBrand=====>', selectedBrand)}*/}
          <h4 className={styles.header}>
            Manipulate Data NOT Style!
          </h4>
          <VirtualizedSelect
            labelKey='name'
            
            onChange={(selectedBrand) => {this.handleOnChange(selectedBrand)}}
            
            onInputChange={(e) => {(e !== '') ? this.searchBrandDataOnInputChange(e) : this.renderCompanyAndOpenBrandData() }}
            
            optionRenderer={this.manipulateDataNotStyleRenderer}
            optionHeight={({ option }) => option.type === 'header' ? 35: 25}
            options={this.state.options}
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
    




