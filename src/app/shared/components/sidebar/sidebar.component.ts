import { Component, OnInit } from "@angular/core";
import {
    faChartBar,
    faUsers,
    faUser,
    faUserPlus,
    faToggleOff,
    faToggleOn,
    faCaretDown,
    faCaretUp
} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
    sidebarToggled: boolean = false;
    menuToggled: any = {
        1: false
    };
    icons: any = {
        dashboard: faChartBar,
        employees: faUsers,
        employee: faUser,
        addEmployee: faUserPlus,
        closeSidebar: faToggleOff,
        openSidebar: faToggleOn,
        closeMenu: faCaretDown,
        openMenu: faCaretUp
    };

    constructor() {}

    ngOnInit() {}

    toggleSidebar() {
        this.sidebarToggled = !this.sidebarToggled;
    }

    toggleMenu(id: number) {
        this.menuToggled[id] = !this.menuToggled[id];
    }
}
