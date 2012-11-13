# Hello SymNode

A simple telnet interface for SymConnect.

# Features

* Call a repgen that returns data (RG)
* Run an inquiry on an account (IQ)
* Perform file maintenance on an account (FM)

# Installing Hello SymNode

Hello SymNode requires Node.js 0.8. Visit http://nodejs.org to download and install the latest version of Node.js.

You will also need an unused SymConnect connection to a test SYM. I would not recommend using this sample against a live SYM.

# Configuring

You will need the following information before you begin:

1. IP Address of your Symitar server.
2. The ports assigned to your SymConnect interface.
3. The Unit Number, Unit Type, Card Number, and Card settings. If you don't know this information, the defaults included may work. If not, open a case with Symitar.
4. A test account.

Open the app.js file with a text editor and look for the banner that says: SymConnect Configuration Section. Update addr with the ip address of your host. Update ports with the ports assigned to your test SYM. Update unit number, unit type, card number, and card with your SymConnect settings information (again, if you don't know this information, these defaults may work). Lastly, update account with your test account.

# Start Hello SymNode

Open a Command Prompt (assuming you are using Windows) and navigate to the place where you have the app.js file downloaded. From the command prompt, enter: node app.js

You should get a message that says: SymNode server running on port 3000

# Connecting to Hello SymNode

At this point, Hello SymNode is waiting for you to connect to it and issue a command. You will need to use telnet software like PuTTY to connect to the node application. 

Open PuTTY and for the Host Name (or IP Address), use the IP Address of the computer running the Node.js application (not the IP Address of your Symitar server). The port will be 3000 since our Node.js application is listening on port 3000. Make sure the connection type is set to Raw and click Open.

You can now issues the following commands:

1. RG
2. IQ
3. FM
4. @quit

If you issue the RG command, it will run a repgen (you can change which repgen it runs via the config section). The IQ command does an inquiry and the FM command updates an email address. All of these operate on the test account you configured earlier.

To disconnect, type: @quit

# Hello SymNode on Github

Hello SymNode is also hosted as a Github public repository. Visit https://github.com/ottoradke/Hello-SymNode to find the latest version of this application. I will do my best to keep the PowerOn Market Place version up to date as well.

# License

The Hello SymNode code is free to use and distribute, under the MIT License.


