local http = game:GetService("HttpService")
local RunService = game:GetService("RunService")
local Players = game:GetService("Players")
local random = Random.new()
local ServerKey = tostring(random:NextInteger(10000000, 99999999)) -- awful and unreliable way of generating a key to tie to this server, will need to be changed
local AuthKey = "" -- Replace with the server key in the bot's config
local PostUrl = "" -- The URL to POST to when sending server list-related data
local branch = (game.PlaceId == 452710513 and "Development") or "Release" -- Indicates release or development branch, this functionality is specific to CVRF

local function GenerateInfo(body)
  return {
    Url = PostUrl;
    Method = "POST";
    Headers = {
      ["Content-Type"] = "application/json"
    };
    Body = http:JSONEncode(body)
  }
end

local function PlayerSignal(player, action)
  http:RequestAsync(GenerateInfo({authKey = AuthKey, serverKey = ServerKey, action = action, playerName = (private and "private") or player.Name}))  
end

if RunService:IsStudio() then return end -- Don't send server list data when in studio

local private = game.PrivateServerOwnerId ~= 0

http:RequestAsync(GenerateInfo({authKey = AuthKey, serverKey = ServerKey, action = "start", branch = branch, private = private}))
wait(1)

for _,player in pairs(Players:GetPlayers()) do
  PlayerSignal(player, "playerAdd")
end

Players.PlayerAdded:Connect(function(player)
  PlayerSignal(player, "playerAdd")
end)
Players.PlayerRemoving:Connect(function(player)
  PlayerSignal(player, "playerRemove")
end)

game:BindToClose(function()
  http:RequestAsync(GenerateInfo({authKey = AuthKey, serverKey = ServerKey, action = "stop"}))
end)
