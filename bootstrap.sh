#!/usr/bin/env bash

case $(id -u) in
    0)
		sudo apt-get update
		sudo apt-get install python-software-properties -y
		sudo add-apt-repository ppa:chris-lea/node.js -y
		sudo apt-get update -y
		sudo apt-get install nodejs -y
		sudo apt-get install curl -y
		sudo apt-get install git -y
		sudo -u vagrant -i $0 
		;;
	*)

		
		##################################################################################################
		# Node
		##################################################################################################
		
		# Enable npm to be used without sudo
		npm config set prefix ~/npm

		# Add ~/npm/bin to the PATH variable
		echo "export PATH=$HOME/npm/bin:$PATH" >> ~/.bashrc

		# Execute the .bashrc file
		. ~/.bashrc

		;;
esac
