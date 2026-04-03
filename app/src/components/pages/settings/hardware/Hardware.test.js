//  Copyright (c) 2018-2019 First Foundry Inc. All rights reserved.

import { createWaitForElement, mountWithMocks, getLoggedInEmployeeMockedResponse } from 'utils/test'
import { fetchHardware } from 'ops'
import { HardwareList } from './Hardware'

describe('<Hardware />', () => {
  it('should render a single hardware item', (done) => {
    const model = 'Zebra'
    const ipAddress = '199.66.196.102'
    const macAddress = 'ff:ff:ff:ff:ff:ff'

    const component = mountWithMocks(HardwareList, [
      {
        request: {
          query: fetchHardware,
          variables: {
            storeID: '1',
          },
        },
        result: {
          data: {
            store: {
              id: 'U3RvcmU6MQ==',
              terminals: {
                edges: [
                  {
                    node: {
                      name: 'Example',
                      id: '280472380dsrwewr',
                      hardware: [{
                        hardwareType: 'Label Printer',
                        model,
                        ipAddress,
                        macAddress,
                        __typename: 'TerminalHardware',
                      }],
                      __typename: 'Terminal',
                    },
                    __typename: 'TerminalEdge',
                  },
                ],
                __typename: 'TerminalConnection',
              },
              __typename: 'Store',
            },
          },
        },
      },
      getLoggedInEmployeeMockedResponse,
    ], { venues: { selectedId: '1' } })

    const waitForHardware = createWaitForElement('.HardwareListPure')

    return waitForHardware(component).then(() => {
      expect(component.text()).toContain(model)
      expect(component.text()).toContain(ipAddress)
      expect(component.text()).toContain(macAddress)

      done()
    })
  })
})
