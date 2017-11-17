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
      selectedBrands: [],
      searchString: '',
      companiesWithOpenBrands:[]
    }
    this.handleToggleBrandData = this.handleToggleBrandData.bind(this)
    this.customSelectOptions = this.customSelectOptions.bind(this)
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
    //console.log('is open?', brandGroupName, this.state.openBrandGroupNames, this.state.openBrandGroupNames.includes(brandGroupName));
      return this.state.openBrandGroupNames.includes(brandGroupName);
    }
    /*  Returns a copy of the openBrandGroups object from this component's
      state with a specified brand*/
  getToggledBrandGroup(groupName) {
      if (this.isBrandGroupOpen(groupName) && this.noOpenBrands(groupName)) {
        // If the brand group is open, then we want to remove it from the array
        // containing the names of open brand groups.
        return this.state.openBrandGroupNames.filter(aBrandGroupName => { return aBrandGroupName !== groupName; });
      } else {
        // If the brand group is NOT open, then we want to add it to the
        // array containing the names of open brand groups.
        return [...this.state.openBrandGroupNames, groupName];
      }
    }
    noOpenBrands(groupName){
      if(this.state.companiesWithOpenBrands.includes(groupName)){
        return false;
      }else{
        return true;
      }
    }

// Click (select) a brand
  handleOnChange(selectedBrand){
      // split the selectedBrand string into an array 
      let selectedBrands = selectedBrand.map((value) => {
          return value.name
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
          return company.groupName;
        });
      } 
      // open groupBrandGroupNames will set a state that is also set in search and clicking on a company name.
      // companiesWithOpenBrands is only set here. 
      let companiesWithOpenBrands = [].concat(openBrandGroupNames);
      this.setState({ 
        selectedBrands: selectedBrands,
        openBrandGroupNames: Array.from(new Set(openBrandGroupNames)),
        companiesWithOpenBrands: companiesWithOpenBrands
      });

      return selectedBrand;
    }


// Search 
  searchBrandDataOnInputChange(searchString) {

    let brandData = this.props.brandData;
    let openBrandGroupNames = [].concat(this.state.openBrandGroupNames);
     
    // brand we are looking for     
    searchString = searchString.toLowerCase().trim();

    if (searchString.length >=1) {

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
    // When a user deletes a search querry only companies with selected brands will remain open
    if (searchString.length === 0 ) {
      openBrandGroupNames = this.state.companiesWithOpenBrands;
    }
      this.setState({
              openBrandGroupNames: Array.from(new Set(openBrandGroupNames)),
              searchString: searchString
        });
    }


   /*///////////////////////////////////////////////////////*/
   /*  CUSTOM OPTION RENDER for Maniplate Data NOT Style!   */
   /*///////////////////////////////////////////////////////*/
  customSelectOptions({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, optionIndex, options, selectValue, style, valueArray }) {
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
            {option.name}<span className={styles.affinioReport}> Tribes Report </span>
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
    

    return (
      <div>
          <h4 className={styles.header}>
            Manipulate Data NOT Style!
          </h4>
          <VirtualizedSelect
            labelKey='name'
            onChange={(selectedBrand) => {this.handleOnChange(selectedBrand) }}
            onInputChange={(searchString) => {this.searchBrandDataOnInputChange(searchString)}}
            closeOnSelect={false}
            optionRenderer={this.customSelectOptions}
            optionHeight={({ option }) => option.type === 'header' ? 35: 25}
            options={this.renderCompanyAndOpenBrandData()}
            ref={(ref) => this._customOptionHeightsSelect = ref}
            searchable={true}
            value={selectedBrands}
            valueKey='name'
            multi={true}
          />
      </div>
    )
  }







}
    




