mod ui;

use std::{future::Future, sync::mpsc::{channel, Receiver}, thread};

use vizia::prelude::*;
use ui::CProBool;
use rfd::{AsyncFileDialog, FileDialog};

#[derive(Clone, Copy)]
pub enum AppEvent {
    ToggleOpt1,
    ToggleOpt2,
    File
}

pub enum FilePickingState {
    Has,
    Picking,
    Empty
}

#[derive(Lens)]
pub struct AppData {
    pub opt1: bool,
    pub opt2: bool,
    
    pub file: String,
    has_file: FilePickingState,
    frecv: Option<Receiver<(String, bool)>>
}

impl Model for AppData {
    fn event(&mut self, cx: &mut EventContext, event: &mut Event) {
        event.map(|app_event, meta| match app_event {
            AppEvent::ToggleOpt1 => self.opt1 ^= true,
            AppEvent::ToggleOpt2 => self.opt2 ^= true,
            AppEvent::File => {
                self.file_dialog()
            }
        })
    }
}

impl AppData {
    pub fn new() -> Self {
        Self {
            opt1: false,
            opt2: false,
            file: "".to_owned(),
            has_file: FilePickingState::Empty,
            frecv: None
        }
    }

    pub fn file_dialog(&mut self) {
        let (send, recv) = channel();
        thread::spawn(move || {
            let file = FileDialog::new()
                .add_filter("ChordPro", &["cho"])
                .pick_file();

            let res = if let Some(f) = file {
                (f.to_str().unwrap().to_owned(), true)
            } else {
                ("".to_owned(), false)
            };
            send.send(res)
        });
        self.frecv = Some(recv);
        self.has_file = FilePickingState::Picking;
    }
}

fn main() {
    Application::new(|cx| {
        cx.add_stylesheet(include_style!("src/style.css")).expect("Failed to load stylesheet");

        let mut app = AppData::new();

        app.build(cx);

        CProBool::new("cb1", "Option 1", AppEvent::ToggleOpt1, cx, AppData::opt1);
        CProBool::new("cb2", "Option 2", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
        CProBool::new("cb3", "Option 3", AppEvent::ToggleOpt2, cx, AppData::opt2);
    })
    .title("Counter")
    .run();
}
