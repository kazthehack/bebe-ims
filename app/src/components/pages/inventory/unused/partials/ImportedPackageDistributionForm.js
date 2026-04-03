//  Copyright (c) 2017 First Foundry LLC. All rights reserved.
//  @created: 9/4/2017
//  @author: Konrad Kiss <konrad@firstfoundry.co>

import React from 'react'

import Search from 'components/common/input/Search'
import PropTypes from 'prop-types'
import { Grid, Row, Col } from 'react-styled-flexboxgrid'
import { format } from 'date-fns'
import { DATE_FORMAT } from 'constants/Settings'
import { Table } from 'components/Table'
import mockProductsData from 'data/mockProductsData'
import mockMetrcImportedData from 'data/mockMetrcImportedData'

const cannabisProducts = {
  data: mockProductsData.filter(obj => obj.category.hasCannabis),
  columns: [
    { accessor: 'name', Header: 'Product' },
  ],
}

const styles = {
  searchBar: {
    boxShadow: 'none',
    borderBottom: '1px solid #dddddd',
    margin: '1.6rem 0px 0 auto',
  },
}

const PackageDataRow = props => (
  <Row>
    <Col xs={12} sm={12} md={12} lg={12} style={{ fontSize: '9pt' }}>{props.label}</Col>
    <Col xs={12} sm={12} md={12} lg={12}><strong>{props.children}</strong></Col>
  </Row>
)

PackageDataRow.propTypes = {
  label: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

const PackageDataCol = (props) => {
  const pack = mockMetrcImportedData[props.pageIndex - 1]
  return (
    <Col xs={12} sm={5} md={5} lg={5}>
      <div style={{ fontSize: '14pt', marginBottom: '1.6rem' }}>#{props.pageIndex}</div>
      <PackageDataRow label="METRC Item">{pack.name}</PackageDataRow>
      <PackageDataRow label="Strain">{pack.strain}</PackageDataRow>
      <PackageDataRow label="Quantity">{pack.oz} oz ({pack.g}g)</PackageDataRow>
      <PackageDataRow label="METRC Tag">{pack.tag}</PackageDataRow>
      <PackageDataRow label="Source">{pack.source}</PackageDataRow>
      <PackageDataRow label="THC">{pack.thcPercent}%</PackageDataRow>
      <PackageDataRow label="CBD">{pack.cbdPercent}%</PackageDataRow>
      <PackageDataRow label="Genetics">{pack.geneticsPercent.indica}% indica / {pack.geneticsPercent.sativa}% sativa</PackageDataRow>
      <PackageDataRow label="Received">{format(new Date(pack.received), DATE_FORMAT)}</PackageDataRow>
    </Col>
  )
}

PackageDataCol.propTypes = {
  pageIndex: PropTypes.number.isRequired,
}

const ProductAssignmentCol = props => (
  <Col xs={12} sm={7} md={7} lg={7}>
    <div>Connect this package to an existing product:</div>
    <Search style={styles.searchBar} onSearch={props.onSearchChange} />
    <Table
      columns={cannabisProducts.columns}
      data={props.data}
    />
  </Col>
)

ProductAssignmentCol.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSearchChange: PropTypes.func.isRequired,
}

class ImportedPackageDistributionForm extends React.Component {
  constructor(props, context) {
    super(props, context)

    this.state = {
      pageIndex: 1,
      data: cannabisProducts.data,
    }

    this.onPackPageChange = this.onPackPageChange.bind(this)
    this.onSearchChange = this.onSearchChange.bind(this)
  }

  onPackPageChange(pageIndex) {
    this.setState({ pageIndex })
  }

  onSearchChange(val) {
    this.setState({
      data: val === '' ? cannabisProducts.data : cannabisProducts.data.filter(obj => (
        obj.name.indexOf(val) > -1
      )),
    })
  }

  render() {
    return (
      <Grid fluid>
        <Row>
          <PackageDataCol pageIndex={this.state.pageIndex} />
          <ProductAssignmentCol
            pageIndex={this.state.pageIndex}
            onSearchChange={this.onSearchChange}
            data={this.state.data}
          />
        </Row>
        <Row>
          <Col xs={12} sm={12} md={12} lg={12} style={{ textAlign: 'center' }}>
            {/* TODO: find replacement? seems unused
            <UltimatePagination
              currentPage={this.state.pageIndex}
              totalPages={mockMetrcImportedData.length}
              boundaryPagesRange={1}
              siblingPagesRange={2}
              hidePreviousAndNextPageLinks={false}
              hideFirstAndLastPageLinks={false}
              hideEllipsis={false}
              onChange={this.onPackPageChange}
            />
            */}
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default ImportedPackageDistributionForm
