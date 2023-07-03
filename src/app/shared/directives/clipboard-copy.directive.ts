import { Directive, Input, Output, EventEmitter, HostListener } from "@angular/core";


@Directive({ selector: '[clipboardCopy]' })
export class ClipboardCopyDirective {
    @Input("clipboardCopy") clippings!: string;
    @Output("copied")

    public readonly copied: EventEmitter<string> = new EventEmitter<string>();

    constructor() { }

    @HostListener("click", ["$event"])
    public onClick(event: MouseEvent): void {
        event.stopPropagation();
        event.preventDefault();

        if (!this.clippings)
            return;

        navigator.clipboard.writeText(this.clippings).then().catch(e => console.log(e));
        this.copied.emit(this.clippings);
    }
}
