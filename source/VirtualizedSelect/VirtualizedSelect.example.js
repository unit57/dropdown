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
    const creatableOptions = [
      { label: 'Blue', value: '#00F' },
      { label: 'Green', value: '#0F0' },
      { label: 'Red', value: '#F00' }
    ]
    this.state = {
      clearable: true,
      creatableOptions,
      disabled: false,
      githubUsers: [],
      multi: false,
      searchable: true,
      selectedCreatable: null,
      selectedCity: null,
      showBrands: true,
      options: [],
      openBrandGroupNames: []
    }

    this.handleToggleBrandData = this.handleToggleBrandData.bind(this)
    this.manipulateDataNotStyleRenderer = this.manipulateDataNotStyleRenderer.bind(this)
    this._loadGithubUsers = this._loadGithubUsers.bind(this)

  }
  _goToGithubUser (value) {
    window.open(value.html_url)
  }

  _loadGithubUsers (input) {
    return fetch(`https://api.github.com/search/users?q=${input}`)
      .then((response) => response.json())
      .then((json) => {
        const githubUsers = json.items

        this.setState({ githubUsers })

        return { options: githubUsers }
      })
  }
  


  // gets just the company names when page loads
  componentWillMount(){
    this.renderCompanyAndOpenBrandData();
  }

  areBrandsSelected(){
        if (!this.state.selectedBrand) {
        console.log('there are NO brands selected')
/*        this.setState({
            openBrandGroupNames: []
        })*/
      } else if (!!this.state.selectedBrand) {
        console.log('there are brands selected')
      }
  }


  // check if brands are selected and sets state of selected brands
  handleOnChange(selectedBrand){
    // this.areBrandsSelected()
    this.setState({ selectedBrand },()=>{()=>{this.areBrandsSelected()}})
  }
  
  // take brand data, makes an array of objects and splices in brand data for a company based on its array index
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

 
  // on click get the group name and set the state of openBrandGroupNames to the output of getToggledBrandGroup
  // the run renderBrandData to render changes
  handleToggleBrandData(e, groupName){  
    // console.log('current options ====>',this.state.options)
    this.setState({
      openBrandGroupNames: this.getToggledBrandGroup(groupName)
    },()=> {this.renderCompanyAndOpenBrandData()})
   
  }

  // Run this when the user searches for a brand
  searchBrandDataOnInputChange(e){
        let arr = this.props.brandData;
        
        const searchString = e.toLowerCase();

        const results = arr.filter((obj) => {

        const groupMatches = obj.groupName.toLowerCase().indexOf(searchString) !== -1; //bool
              

        // console.log('group matches', obj.groupName, groupMatches)

          const brands = obj.brands.filter((brand) => {
              return brand.brandName.toLowerCase().indexOf(searchString) !== -1;
          }); 

            if (groupMatches || brands.length > 0) {
              return true;
          }
          return false;
        });
        

        let pushOpenBrandNames = [].concat(this.state.openBrandGroupNames)
        
        let filteredResults = [];

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
               if (pushOpenBrandNames.indexOf(company.groupName) === -1) {
                    pushOpenBrandNames.push(company.groupName)
                   } 
            
        });

       //console.log('results =====>', pushOpenBrandNames)

       //console.log('e+++>', e)


     
      
        this.setState({
          options: filteredResults,
          openBrandGroupNames: pushOpenBrandNames
        },()=>{this.areBrandsSelected()});
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
    const { cityData, countryData, nameData, brandData } = this.props
    const { clearable, creatableOptions, disabled, githubUsers, multi, searchable, selectedCity, selectedCountry, selectedCreatable, selectedGithubUser, selectedName, selectedBrand } = this.state
    
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
            value={selectedBrand}
            valueKey='name'
            multi={true}
          />


        <h4 className={styles.header}>
          Async Options
        </h4>

        <div className={styles.description}>
          Displays an async <code>Select</code> component wired up to search for GitHub users.
        </div>

        <VirtualizedSelect
          async
          backspaceRemoves={false}
          labelKey='login'
          loadOptions={this._loadGithubUsers}
          minimumInput={1}
          onChange={(selectedGithubUser) => this.setState({ selectedGithubUser })}
          onValueClick={this._goToGithubUser}
          options={githubUsers}
          value={selectedGithubUser}
          valueKey='id'
        />
      </div>
    )
  }







}
    




