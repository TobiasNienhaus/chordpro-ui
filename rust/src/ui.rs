use vizia::prelude::*;
use super::AppEvent;

pub trait CProArg<T> {
    fn draw<L>(self, cx: &mut Context, lens: L) -> Handle<Self>
    where
        L: Lens<Target = i32>, Self: Sized;
}

pub struct CProBool {
}

impl View for CProBool {}

impl CProBool {
    pub fn new<'a, L>(id: &'a str, title: &'a str, ev: AppEvent, cx: &'a mut Context, lens: L) -> Handle<'a, Self>
    where
        L: Lens<Target = bool>, Self: Sized {
        Self {}.build(cx, |cx| {
            HStack::new(cx, |cx| {
                Checkbox::new(cx, lens)
                    .on_toggle(move |cx| cx.emit(ev))
                    .id(id);
                Label::new(cx, title).describing(id);
            })
            .size(Auto)
            .col_between(Pixels(5.0))
            .child_top(Stretch(1.0))
            .child_bottom(Stretch(1.0));
        })
    }
}
