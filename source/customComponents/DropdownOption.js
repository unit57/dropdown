import React, { Component } from 'react'
export default class DropdownOption extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
        this.openCloseGroup = this.openCloseGroup.bind(this);
        this.selectBrand = this.selectBrand.bind(this);
    }
    openCloseGroup = function() {
        this.setState({
            isOpen: !this.state.isOpen
        });
    }
    selectBrand = function(brand) {
        
        this.props.selectValue(brand);
    }
    get brandOptions() {
        if(this.state.isOpen) {
            return this.props.option.brands.map((brandObj, i) => {
                var key = this.props.key + '-' + i;
                return (
                    /* BRANDS */
                    <div
                        key = {key}
                        onClick={() => this.props.selectValue(brandObj)}
                        onMouseEnter={() => this.props.focusOption(brandObj)}

                        
                    >
                        {brandObj.brandName}
                    </div>
                );
            });
        }
    }

    render() {
        const option = this.props.option;
        return (
            <div>
        {/*  COMPANY NAME */}
                <div
                  className={this.props.styles.nameHeader}
                  key={this.props.key}
                  style={this.props.style}
                  onClick={() => this.openCloseGroup()}
                >
                  {option.groupName}
                </div>
        {/* BRANDS */}
                <ul>
                    {this.brandOptions}
                </ul>
            </div>
        );
    }
}