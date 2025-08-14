---
title: "Installation"
description: "Instructions for installing our software on different operating systems."
weight: 2
---

Installing our software is straightforward. Select your operating system below for specific instructions:

{{< tabs >}}
{{< tab "Windows" "windows" >}}
1. Download the Windows installer (.exe) from the [download page](/en/download).
2. Navigate to the folder in which the EXE installer was downloaded and double-click on it to start the installation process.
3. Windows may display the following dialog. In this case, click on **More information** and continue with the **Run anyway** button.
   - ![Windows Security Warning Dialog 1](images/windows/step_1.png)
   - ![Windows Security Warning Dialog 2](images/windows/step_1.1.png)
4. Once the installer has started, accept the terms in the licence agreement and click on **Install**. To read the licence agreement, click on the **license terms** link.
   - ![Windows Setup](images/windows/step_2.png)
   #### Extended Setup
   You can customize the installation of lectureStudio by clicking on the **Options** button. Now you can choose whether to create shortcut icons for applications on the desktop and in the start menu. To change the installation folder, click on the **Browse** button.
   - ![Windows Setup Extended](images/windows/step_2.1.png)
5. Windows will ask for elevated permissions to allow the installer to make changes to your device. Accept the request.
   - ![Windows Permissions](images/windows/step_3.png)
6. Click on the **Close** button when the installation is complete.
   - ![Windows Setup Finish](images/windows/step_4.png)
7. After installation, you will find shortcut icons for the applications on the desktop and in the start menu if you have activated their creation in step 4 of the advanced setup.
   - ![Windows Desktop Icons](images/windows/step_5.0.png)
   - ![Windows Start Menu Icons](images/windows/step_5.1.png)
{{< /tab >}}

{{< tab "macOS" "macos" >}}
1. Download the macOS package (.pkg) from the [download page](/en/download).
2. Navigate to the folder in which the installation package was downloaded and double-click on it to start the installation process.
3. Once the installation has started, continue after the introduction and accept the conditions in the licence agreement. To read the licence agreement, click on the **Read licence** button. Once you have accepted the licence agreement, click **Continue**.
   - ![macOS Setup Start](images/macos/step_1.png)
   - ![macOS EULA Accept](images/macos/step_2.png)
4. You can now install lectureStudio on the drive. Click on **Install**. macOS requests elevated authorisations so that the installation can make changes to your device. To do this, enter your user name and password and click on **Install Software**.
   - ![macOS Install](images/macos/step_3.png)
   - ![macOS Permissions](images/macos/step_4.png)
5. Once the installation has been successfully completed, click on the **Close** button.
   - ![macOS Setup Finish](images/macos/step_5.png)
6. After installation, you will find shortcut icons for the applications in the Launchpad.
   - ![macOS Applications Icons](images/macos/step_6.png)
{{< /tab >}}

{{< tab "Linux" "linux" >}}
1. Download the appropriate package for your distribution from the [download page](/en/download).
2. Navigate to the folder in which the package was downloaded.
3. For Debian/Ubuntu:
   ```bash
   sudo dpkg -i lecturestudio_*-linux_amd64.deb
   ```
   In case dpkg installs the .deb file but says that required packages are missing, run the following command to fix missing dependencies:
   ```bash
   sudo apt-get install -f
   ```
4. For Fedora/RHEL:
   ```bash
   sudo rpm -i lecturestudio-*-linux.x86_64.rpm 
   ```
5. Install ZIP archive:
   1. Unpack the archive via the command line or via the context menu of the graphical user interface.
      Unpack in the command line:
      ```bash
      unzip lectureStudio-*-linux-x86_64.zip 
      ```
   2. Copy the unpacked lectureStudio directory to its final destination.
   3. The applications can be found in the **bin** directory of the lectureStudio directory.
6. Launch the applications from your applications menu or terminal with **lecturePresenter** or **lectureEditor**.
{{< /tab >}}
{{< /tabs >}}
