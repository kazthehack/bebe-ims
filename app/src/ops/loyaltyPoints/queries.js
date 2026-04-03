import { op as operation } from 'api/operation'

// Get Customers List
export const getLoyaltyMembers = operation`
  query getLoyaltyMembers($filter: LoyaltyMemberFilterInput, $storeID: ID!) {
    store(id: $storeID) {
      id
      loyaltyMembers(filterBy: $filter){
        totalCount
        edges {
          cursor
          node {
            email
            phoneNumber
            uuid
            joinedDate
            id
            points {
              current
            }
          }
        }
      }
    }
  }
`

// Get Customer details
export const getCustomerDetails = operation`
  query getCustomerDetails($memberID: ID!){
    node(id: $memberID) {
      ... on LoyaltyMember{
        phoneNumber,
        uuid,
        joinedDate,
        email
        points {
          current
          earned
          used
          added
          removed
        }
      }
    }
  }
`

export const getLoyaltyPointAdjustments = operation`
  query GetLoyaltyPointAdjustments($memberID: ID!) {
    node(id: $memberID) {
      ... on LoyaltyMember {
        pointAdjustments {  
          edges {
            node {
              points
              reason
              employee {
                name
              }
              createdAt
            }
          }
        }
      }
    }
  }
`

// Get Rewards List
export const getRewards = operation`
  query getRewards($filter: RewardFilterInput, $storeID: ID!) {
    store(id: $storeID) {
      id
      rewards(filterBy: $filter){
        totalCount
        edges {
          cursor
          node {
            name
            customerType
            appliesTo
            category
            amountType
            amount
            active
            pointCost
            archivedDate
            id
          }
        }
      }
    }
  }
`

// Get Reward details
export const getRewardDetails = operation`
  query getRewardDetails($rewardID: ID!){
    node(id: $rewardID) {
      ... on Reward{
        name
        customerType
        appliesTo
        category
        amountType
        amount
        active
        pointCost
        archivedDate
      }
    }
  }
`

export const getLoyaltyMemberPoints = operation`
  query GetLoyaltyMemberPoints($memberID: ID!) {
    node(id: $memberID) {
      ... on LoyaltyPoints {
        id,
        current,
        earned,
        used,
        added,
        removed,
      }
    }
  }
`
