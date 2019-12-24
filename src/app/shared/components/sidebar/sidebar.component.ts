import { Component, OnInit } from "@angular/core";
import {
    faChartBar,
    faUsers,
    faUser,
    faUserPlus,
    faToggleOff,
    faToggleOn,
    faCaretDown,
    faCaretUp,
    IconDefinition
} from "@fortawesome/free-solid-svg-icons";

@Component({
    selector: "app-sidebar",
    templateUrl: "./sidebar.component.html",
    styleUrls: ["./sidebar.component.scss"]
})
export class SidebarComponent implements OnInit {
    sidebarToggled: boolean = false;
    menuToggled: { [key: number]: boolean } = {
        1: false
    };

    icons: { [key: string]: IconDefinition } = {
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
