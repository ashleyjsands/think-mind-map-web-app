findThoughtByName = "SELECT * FROM Thought WHERE name = '{thoughtName}'"

findUserWithClaimId = "SELECT * FROM User WHERE claimedId = '{claimedId}'"

findThoughtPermissoin = "SELECT * FROM Permission WHERE thought = key('{thoughtKey}')"

findUserPermissionsForThought = "SELECT * FROM Permission WHERE user = key('{userKey}') AND thought = key('{thoughtKey}')"

findThoughtConnection = "SELECT * FROM Connection WHERE thought = key('{thoughtKey}')"