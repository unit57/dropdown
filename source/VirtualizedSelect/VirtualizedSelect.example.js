import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { Creatable } from 'react-select'
import 'whatwg-fetch'
import VirtualizedSelect from './VirtualizedSelect'
import DropdownOption from '../customComponents/DropdownOption.js'
import styles from './VirtualizedSelect.example.css'

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
      selectedIndex: 2
    }
    this.handleHideBrands = this.handleHideBrands.bind(this)
    this.handleHideBrandData = this.handleHideBrandData.bind(this)
    this._loadGithubUsers = this._loadGithubUsers.bind(this) 
    this.formattedBrandDataRenderer = this.formattedBrandDataRenderer.bind(this)
    this.manipulateDataNotStyleRenderer = this.manipulateDataNotStyleRenderer.bind(this)


  }
  /* HIDE BRANDS IN FLATTENED DATA */
  handleHideBrands(e) {
    this.setState({
      showBrands: !this.state.showBrands
    })
    let childrenBrandsClass = e.target.id.toLowerCase().replace(' ', '-') + '-group'
  }

  /* ///////////////////////////////////////// */
  /* ///OPTION RENDERER FOR FLATTENED DATA  // */
  /* ///////////////////////////////////////// */ 
  formattedBrandDataRenderer({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, optionIndex, options, selectValue, style, valueArray }) {
      const classNames = [styles.nameOption]


      if (option.type === 'header') {
        /*//////////////////////////////////////*/
        /*////////// COMPANY NAME //////////////*/
        /*//////////////////////////////////////*/
        classNames.push(styles.nameHeader)
        return (
          <div
            onClick={(e) => this.handleHideBrands(e)}
            className={classNames.join(' ')}
            key={key}
            style={style}
            id = {option.name}
          >
            {option.name} 
          </div>
        )
      } else if (option.type === 'affino' ){
        /*//////////////////////////////////////*/
        /*///GRAY 'BRAND' OPTION IN DROP DOWN //*/
        /*//////////////////////////////////////*/
        classNames.push(styles.affino)
        let affinoClassNames = classNames.join(' ');

        let showBrands = (affinoClassNames + " " + option.group);
        let hideBrands = styles.hideBrands;
  
        return (
        
          <div
            key={key}
            className={(this.state.showBrands)? showBrands : hideBrands}
            style={style}
          >
            {option.name}<span className={styles.affinoReport}> Affino Report </span>
          </div>
        )

      } else {
          
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
            className={(this.state.showBrands)? showBrands : hideBrands}
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
  /* ///////////////////////////////////////// */
  /* FORMAT DATA FOR FLATTENED FLATTENED DATA  */
  /* ///////////////////////////////////////// */
  get formattedBrandData() {
      const brandData = this.props.brandData;
      var data = [];
      brandData.forEach((brandObj, i)=> {
          //create the header row.
          var headerRow = {};
          headerRow['type'] = 'header';
          headerRow['name'] = brandObj.groupName;
          headerRow['code'] = '';
          data.push(headerRow);
          // create affino div
          var affinoRow = {};
          affinoRow['type'] = 'affino';
          affinoRow['name'] = 'Brand';
          affinoRow['code'] = '';
        
          affinoRow['group'] = brandObj.groupName.toLowerCase().replace(' ', '-')+'-group';
          if (brandObj.brands.length !== 0 ){
          data.push(affinoRow)
          }
          //create a row for each brand
          brandObj.brands.forEach((brand, j) => {
              var brandRow = {};
              brandRow['type'] = 'country';
              brandRow['name'] = brand.brandName;
              brandRow['code'] = brand.countryCode;
              brandRow['flagName'] = brand.countryName;
              brandRow['group'] = brandObj.groupName.toLowerCase().replace(' ', '-')+'-group';;
              data.push(brandRow);
          });
      });

      return data;
  }

/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
  
  /*///////////////////////////////////////////////////////*/
  /* ///////////////   Format Data    /////////////////////*/
  /*///////////////////////////////////////////////////////*/

  reformatBrandData() {

      const data = this.props.brandData;

      let options = [];

      data.forEach((option, index) => {
          //create the header row.
          var headerRow = {};
          headerRow['type'] = 'header';
          headerRow['name'] = option.groupName;
          headerRow['code'] = '';
          headerRow['index'] = index;
          
          options.push(headerRow);

/*          if(index === this.state.selectedIndex) {
              var affinoRow = {};
              affinoRow['type'] = 'affino';
              affinoRow['name'] = 'Brand';
              affinoRow['code'] = '';
              options.push(affinoRow)
          }*/
      });

          


      const newOptions = [].concat(options);
      /*console.log('newOptions', newOptions)*/

      let indexClicked = this.state.selectedIndex;

      let brandOptions = [];

      data[indexClicked].brands.map(brand => {
          var brandRow = {};
          brandRow['type'] = 'country';
          brandRow['name'] = brand.brandName;
          brandRow['code'] = brand.countryCode;
          brandRow['flagName'] = brand.countryName;

          brandOptions.push(brandRow)
      })
      
      newOptions.splice(indexClicked+1, 0, ...brandOptions)
      
      
      this.setState({
        options: newOptions
      },()=>{ console.log('current options', this.state.options)});
  }
  
  /*///////////////////////////////////////////////////////*/
  /* /////////////// GET INITIAL DATA /////////////////////*/
  /*///////////////////////////////////////////////////////*/
  componentWillMount(){
      const data = this.props.brandData;

      let options = [];

      data.forEach((option, index) => {
          //create the header row.
          var headerRow = {};
          headerRow['type'] = 'header';
          headerRow['name'] = option.groupName;
          headerRow['code'] = '';
          headerRow['index'] = index;
          
          options.push(headerRow);
      });
      this.setState({
        options: options
      });
  }
   /*//////////////////////////////////////////////////////////////*/
   /*// CHANGE DATA BASED ON CLICK for MANIPULATE DATA NOT STYLE //*/
   /*//////////////////////////////////////////////////////////////*/
  handleHideBrandData(e){
    console.log('name', e.target.innerHTML, 'index', e.target.id)
  
    
    this.setState({
      selectedIndex: e.target.id
    },()=> {this.reformatBrandData()})
    /* I'm probably doing this wrong */
    

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
        return (
          <div
            onClick={(e)=> this.handleHideBrandData(e)}
            className={classNames.join(' ')}
            key={key}
            style={style}
            id = {option.index}
          >
            {option.name} 
          </div>
        )
      } else if (option.type === 'affino' ){
        /*//////////////////////////////////////*/
        /*///GRAY 'BRAND' OPTION IN DROP DOWN //*/
        /*//////////////////////////////////////*/
        classNames.push(styles.affino)
        let affinoClassNames = classNames.join(' ');

        let showBrands = (affinoClassNames + " " + option.group);
        let hideBrands = styles.hideBrands;
  
        return (
        
          <div
            key={key}
            className={showBrands}
            style={style}
          >
            {option.name}<span className={styles.affinoReport}> Affino Report </span>
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
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/
/*///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////*/

  render () {
    const { cityData, countryData, nameData, brandData } = this.props
    const { clearable, creatableOptions, disabled, githubUsers, multi, searchable, selectedCity, selectedCountry, selectedCreatable, selectedGithubUser, selectedName, selectedBrand } = this.state
    
    /*optionHeight={({ option }) => option.type === 'header' ? 35: 25}*/
    // optionRenderer={this.manipulateDataNotStyleRenderer}

    return (
      <div>
   
    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////    Maniplate Data NOT Style!   ///////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
          <h4 className={styles.header}>
            Manipulate Data NOT Style!
          </h4>
          <VirtualizedSelect
            labelKey='name'
            onChange={(selectedBrand) => this.setState({ selectedBrand })}
            onInputChange={() => this._customOptionHeightsSelect && this._customOptionHeightsSelect.recomputeOptionHeights()}
            optionRenderer={this.manipulateDataNotStyleRenderer}
            optionHeight={({ option }) => option.type === 'header' ? 35: 25}
            options={this.state.options}
            ref={(ref) => this._customOptionHeightsSelect = ref}
            searchable={searchable}
            simpleValue
            value={selectedBrand}
            valueKey='name'
            multi={multi}
          />

    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////    FLATTENED DATA SELECT    //////////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
          <h4 className={styles.header}>
            Flattened Data
          </h4>
          <VirtualizedSelect
            labelKey='name'
            onChange={(selectedName) => this.setState({ selectedName })}
            onInputChange={() => this._customOptionHeightsSelect && this._customOptionHeightsSelect.recomputeOptionHeights()}
            optionHeight={({ option }) => option.type === 'header' ? 35: 25}
            optionRenderer={this.formattedBrandDataRenderer}
            options={this.formattedBrandData}
            ref={(ref) => this._customOptionHeightsSelect = ref}
            searchable={searchable}
            simpleValue
            value={selectedName}
            valueKey='name'
            multi={multi}
          />     
           
    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////    SELECT With NESTED BRANDS     /////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
          <h4 className={styles.header}>
            Nested Brands
          </h4>
          <VirtualizedSelect
            labelKey='name'
            onChange={(selectedName) => this.setState({ selectedName })}
            onInputChange={() => this._customOptionHeightsSelect && this._customOptionHeightsSelect.recomputeOptionHeights()}
            optionHeight={({ option }) => option.type === 'header' ? 75 : 75}
            optionRenderer={BrandOptionRenderer}
            options={this.props.brandData}
            ref={(ref) => this._customOptionHeightsSelect = ref}
            searchable={searchable}
            simpleValue
            value={selectedName}
            valueKey='name'
          />
     {/*/////////////////////////////////////////////////////////////////*/}
     {/*/////////////////////////////////////////////////////////////////*/}
     {/*/////////////////////////////////////////////////////////////////*/}
        <h4 className={styles.header}>
          Default Option Renderer
        </h4>
        <div className={styles.description}>
          Displays a list of the 1,000 largest cities in the world using the default option-renderer.
        </div>
        <div className={styles.description}>
          Cities with names beginning with "y" have been disabled.
        </div>

    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////   DEFAULT OPTION RENDERER   //////////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
        <VirtualizedSelect
          autofocus
          clearable={clearable}
          disabled={disabled}
          labelKey='name'
          multi={multi}
          onChange={(selectedCity) => {
            console.log('selectedCity', selectedCity);
            this.setState({ selectedCity })
        }}
          options={cityData}
          searchable={searchable}
          simpleValue
          value={selectedCity}
          valueKey='name'
        />
        <ul className={styles.optionsList}>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={multi}
                name='multi'
                onChange={(event) => this.setState({ multi: event.target.checked })}
                type='checkbox'
              />
              Multi-select?
            </label>
          </li>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={searchable}
                name='searchable'
                onChange={(event) => this.setState({ searchable: event.target.checked })}
                type='checkbox'
              />
              Searchable?
            </label>
          </li>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={clearable}
                name='clearable'
                onChange={(event) => this.setState({ clearable: event.target.checked })}
                type='checkbox'
              />
              Clearable?
            </label>
          </li>
          <li className={styles.optionListItem}>
            <label>
              <input
                defaultChecked={disabled}
                name='disabled'
                onChange={(event) => this.setState({ disabled: event.target.checked })}
                type='checkbox'
              />
              Disabled?
            </label>
          </li>
        </ul>
        <h4 className={styles.header}>
          Custom Option Renderer
        </h4>
        <div className={styles.description}>
          Displays a list of world countries using a custom option renderer.
        </div>
    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////    CUSTOM OPTION  RENDERER     ///////////////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
        <VirtualizedSelect
          labelKey='name'
          onChange={(selectedCountry) => {
            console.log('selectedCountry', selectedCountry)
            this.setState({ selectedCountry })}
          }
          optionRenderer={CountryOptionRenderer}
          optionHeight={40}
          options={countryData}
          multi={true}
          simpleValue
          value={selectedCountry}
          valueKey='code'
        />
        <h4 className={styles.header}>
          Dynamic Height Options
        </h4>
        <div className={styles.description}>
          Displays option-group headers that are sized different than regular options.
          Demonstrates how to use dynamic option heights feature.
        </div>
    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////    NAME SELECT         ///////////////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
        <VirtualizedSelect
          labelKey='name'
          onChange={(selectedName) => this.setState({ selectedName })}
          onInputChange={() => this._customOptionHeightsSelect && this._customOptionHeightsSelect.recomputeOptionHeights()}
          optionHeight={({ option }) => option.type === 'header' ? 25 : 35} 
          optionRenderer={NameOptionRenderer}
          options={nameData}
          //multi={true}
          ref={(ref) => this._customOptionHeightsSelect = ref}
          searchable={searchable}
          simpleValue
          value={selectedName}
          valueKey='name'
        />
        <h4 className={styles.header}>
          Async Options
        </h4>
        <div className={styles.description}>
          Displays an async <code>Select</code> component wired up to search for GitHub users.
        </div>
    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////         IGNORE         ///////////////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
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
        <h4 className={styles.header}>
          Creatable Options
        </h4>
        <div className={styles.description}>
          Displays a <code>Select.Creatable</code> component that enables users to create their own options.
        </div>
    {/*/////////////////////////////////////////////////////////////////*/}
    {/*//////////////////         IGNORE         ///////////////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}
        <VirtualizedSelect
          labelKey='label'
          multi
          onChange={(selectedCreatable) => this.setState({ selectedCreatable })}
          optionHeight={40}
          options={creatableOptions}
          selectComponent={Creatable}
          simpleValue
          value={selectedCreatable}
          valueKey='value'
        />
      </div>
    )
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
}
    


     {/*/////////////////////////////////////////////////////////////////*/}
     {/*/////////////// Formatted Brand OPTION RENDERER //////// ////////*/}
     {/*/////////////////////////////////////////////////////////////////*/}

    


     {/*/////////////////////////////////////////////////////////////////*/}
     {/*/////////////// BRAND OPTION RENDERER ///////////////////////////*/}
     {/*/////////////////////////////////////////////////////////////////*/}
function BrandOptionRenderer({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, optionIndex, options, selectValue, style, valueArray }) {
    return(
        <DropdownOption key={key} option={option} style={style} selectValue={selectValue} styles={styles} focusOption={focusOption}/>
    );
}
    {/*/////////////////////////////////////////////////////////////////*/}
    {/*/////////////////////////////////////////////////////////////////*/}



     {/*/////////////////////////////////////////////////////////////////*/}
     {/*/////////////// COUNTRY OPTION RENDERER /////////////////////////*/}
     {/*/////////////////////////////////////////////////////////////////*/}


function CountryOptionRenderer ({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, options, selectValue, style, valueArray }) {
  console.log('focusedOption', focusedOption, 'focusedOptionIndex', focusedOptionIndex, 'key', key, 'labelKey', labelKey, 'option', option, 'options', options, 'selectValue', selectValue, 'style', style, 'valueArray', valueArray);
  const flagImageUrl = `https://cdn.rawgit.com/hjnilsson/country-flags/9e827754/svg/${option.code.toLowerCase()}.svg`
  const classNames = [styles.countryOption]
  if (option === focusedOption) {
    classNames.push(styles.countryOptionFocused)
  }
  if (valueArray && valueArray.indexOf(option) >= 0) {
    classNames.push(styles.countryOptionSelected)
  }
  return (
    <div
      className={classNames.join(' ')}
      key={key}
      onClick={() => selectValue(option)}
      onMouseEnter={() => focusOption(option)}
      style={style}
    >
      <label className={styles.countryLabel}>
        {option.name}
      </label>
      <img
        className={styles.countryFlag}
        src={flagImageUrl}
      />
    </div>
  )
}

     {/*/////////////////////////////////////////////////////////////////*/}
     {/*//////////////// NAME OPTION RENDERER ///////////////////////////*/}
     {/*/////////////////////////////////////////////////////////////////*/}

function NameOptionRenderer ({ focusedOption, focusedOptionIndex, focusOption, key, labelKey, option, optionIndex, options, selectValue, style, valueArray }) {
  const classNames = [styles.nameOption]
  if (option.type === 'header') {
    classNames.push(styles.nameHeader)
    return (
      <div
        className={classNames.join(' ')}
        key={key}
        style={style}
      >
        {option.name}
      </div>
    )
  } else {
    if (option === focusedOption) {
      classNames.push(styles.nameOptionFocused)
    }
    if (valueArray.indexOf(option) >= 0) {
      classNames.push(styles.nameOptionSelected)
    }
    return (
      <div
        className={classNames.join(' ')}
        key={key}
        onClick={() => selectValue(option)}
        onMouseEnter={() => focusOption(option)}
        style={style}
      >
        {option.name}
      </div>
    )
  }
}