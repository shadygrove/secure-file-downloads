import {
  Component,
  EventEmitter,
  forwardRef,
  Injector,
  Input,
  OnInit,
  Output,
  Renderer2,
} from "@angular/core";
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from "@angular/cdk/drag-drop";
import { LoggerService } from "../../services/logger.service";
import { SelectItem } from "../../models/select-item.model";
import {
  ControlContainer,
  ControlValueAccessor,
  FormControl,
  NG_VALUE_ACCESSOR,
} from "@angular/forms";
import { CustomControlAccessorBase } from "../CustomControlAccessorBase.component";

@Component({
  selector: "app-dual-list",
  templateUrl: "./dual-list.component.html",
  styleUrls: ["./dual-list.component.scss"],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DualListComponent),
    },
  ],
})
export class DualListComponent
  extends CustomControlAccessorBase<SelectItem[]>
  implements OnInit
{
  value: SelectItem[];

  private optionsCache: SelectItem[];

  @Input()
  options: SelectItem[];

  unselected: SelectItem[];

  constructor(
    controlContainer: ControlContainer,
    private logger: LoggerService
  ) {
    super(controlContainer);
  }

  ngOnInit() {
    this.init();

    this.optionsCache = this.options;

    this.writeEvent$.subscribe({
      next: () => {
        this.options = this.optionsCache;
        this.init();
      },
    });
  }

  init() {
    // split selected/unselected
    this.unselected = this.options.filter(
      (i) => !this.value?.some((v) => v.key === i.key)
    );
  }

  drop(event: CdkDragDrop<SelectItem[], any>) {
    this.logger.debug("Example DragDrop Container", event.container.data);
    this.logger.debug(
      "Example DragDrop Prev Container",
      event.previousContainer.data
    );

    // moveItemInArray(this.unselected, event.previousIndex, event.currentIndex);

    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    this.onTouched();

    this.logger.debug("DROPPED");
    this.onChange(this.value);
  }
}
