import { V2ContractName } from 'models/v2/contracts'

import useContractReader from './V2ContractReader'

export enum V2OperatorPermission {
  'RECONFIGURE' = 1,
  'REDEEM' = 2,
  'MIGRATE_CONTROLLER' = 3,
  'MIGRATE_TERMINAL' = 4,
  'PROCESS_FEES' = 5,
  'SET_METADATA' = 6,
  'ISSUE' = 7,
  'CHANGE_TOKEN' = 8,
  'MINT' = 9,
  'BURN' = 10,
  'CLAIM' = 11,
  'TRANSFER' = 12,
  'REQUIRE_CLAIM' = 13,
  'SET_CONTROLLER' = 14,
  'SET_TERMINALS' = 15,
  'SET_PRIMARY_TERMINAL' = 16,
  'USE_ALLOWANCE' = 17,
  'SET_SPLITS' = 18,
}

export function useHasPermission({
  operator,
  account,
  domain,
  permissions,
}: {
  operator: string | undefined
  account: string | undefined
  domain: number | undefined
  permissions: V2OperatorPermission[]
}) {
  const hasOperatorPermission = useContractReader<boolean>({
    contract: V2ContractName.JBOperatorStore,
    functionName: 'hasPermissions',
    args:
      operator && account && domain !== undefined && permissions
        ? [
            operator, // _operator
            account, // _account
            domain, // _domain
            permissions,
          ]
        : null,
  })

  return hasOperatorPermission
}
