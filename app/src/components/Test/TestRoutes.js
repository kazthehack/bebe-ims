//  Copyright (c) 2019 First Foundry Inc. All rights reserved.

import React from 'react'
import PropTypes from 'prop-types'
import { Switch, Route } from 'react-router-dom'
import { withRouter } from 'react-router'
import { PageNotFound } from 'components/pages/ErrorPage'
import Modals from './Modals'
import ModalPopups from './Modals/ModalPopups'
import InventoryManifestModal from './Modals/InventoryManifestModal'
import Fill from './Fill'
import Loading from './Loading'
import Date from './Date'
import Notifications from './Notifications'
import ExampleForm from './ExampleForm'
import DesignReferencePage from './Design'
import ToolTipsReferencePage from './Tooltips'
import Pagination from './Pagination'
import IconsReference from './Icons'
import ErrorExample from './Error'
import API from './API/'
import ReportsPage from './Reports'
import Search from './Search'
import UserNotifications from '../pages/alerts'
import LogsTable from '../common/logs/LogsTable'
import TransactionDetail from '../../components/TransactionDetail'
import ProductLogs from '../../components/pages/logs/product/ProductLogs'
import PriceGroupLogs from '../../components/pages/logs/pricegroup/PriceGroupLogs'

const TestRoutes = ({ match }) => (
  <Switch>
    <Route path={`${match.url}/api`} component={API} />
    <Route path={`${match.url}/foobar`} render={() => <h2>FOOBAR</h2>} />
    <Route exact path={`${match.url}/modals`} component={Modals} />
    <Route path={`${match.url}/modals/popups`} component={ModalPopups} />
    <Route path={`${match.url}/fill`} component={Fill} />
    <Route path={`${match.url}/loading`} component={Loading} />
    <Route path={`${match.url}/form`} component={ExampleForm} />
    <Route path={`${match.url}/date`} component={Date} />
    <Route path={`${match.url}/notifications`} component={Notifications} />
    <Route path={`${match.url}/design`} component={DesignReferencePage} />
    <Route path={`${match.url}/pagination`} component={Pagination} />
    <Route path={`${match.url}/tooltips`} component={ToolTipsReferencePage} />
    <Route path={`${match.url}/icons`} component={IconsReference} />
    <Route path={`${match.url}/error`} component={ErrorExample} />
    <Route path={`${match.url}/reports`} component={ReportsPage} />
    <Route path={`${match.url}/usernotifications`} component={UserNotifications} />
    <Route path={`${match.url}/search`} component={Search} />
    <Route path={`${match.url}/logstable`} component={LogsTable} />
    <Route path={`${match.url}/transactiondetail`} component={TransactionDetail} />
    <Route path={`${match.url}/productlogs/UGFja2FnZToxNjE1`} component={ProductLogs} />
    <Route path={`${match.url}/pricegrouplogs/UGFja2FnZToxNjE1`} component={PriceGroupLogs} />
    <Route path={`${match.url}/inventorymanifest`} component={InventoryManifestModal} />
    {/* If none of the above routes matches, show the 404 error page */}
    <Route component={PageNotFound(false)} />
  </Switch>
)

TestRoutes.propTypes = {
  match: PropTypes.shape({
    url: PropTypes.string,
  }),
}

export default withRouter(TestRoutes)
