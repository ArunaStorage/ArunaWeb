use cfg_if::cfg_if;
use gloo_events::EventListener;
use leptos::*;
use leptos_meta::*;
use leptos_router::*;
use regex::Regex;
#[allow(unused_imports)]
use std::time::Duration;

use crate::utils::modal::hide_modal;

#[server(RegisterUser, "/web")]
pub async fn register_user(
    _displayname: String,
    _email: String,
    _project: String,
) -> Result<(), ServerFnError> {
    // use crate::utils::aruna_api_handlers::aruna_register_user;
    // use actix_session::SessionExt;
    // use actix_web::HttpRequest;
    // let req = use_context::<HttpRequest>().unwrap();

    // let sess = req.get_session();

    // let token = sess
    //     .get::<String>("token")
    //     .map_err(|_| ServerFnError::Request("Invalid request".to_string()))?
    //     .ok_or_else(|| ServerFnError::Request("Invalid request".to_string()))?;

    // let resp = aruna_register_user(&token, &displayname, &email, &project)
    //     .await
    //     .map_err(|_| ServerFnError::Request("Invalid request".to_string()))?;

    // sess.insert("user_id", resp)
    //     .map_err(|_| ServerFnError::Request("Invalid request".to_string()))?;

    Ok(())
}

#[server(CheckActivated, "/web")]
pub async fn check_activated() -> Result<bool, ServerFnError> {
    /*     use crate::utils::aruna_api_handlers::who_am_i;
    use actix_session::SessionExt;
    use actix_web::HttpRequest;
    let req = use_context::<HttpRequest>().unwrap();

    let sess = req.get_session();

    let token = sess
        .get::<String>("token")
        .map_err(|_| ServerFnError::Request("Invalid request".to_string()))?
        .ok_or_else(|| ServerFnError::Request("Invalid request".to_string()))?;

    match who_am_i(&token).await {
        Ok(_) => Ok(true),
        _ => Ok(false),
    } */
    Ok(true)
}

/// Renders the home page of your application.
#[component]
pub fn RegisterPage() -> impl IntoView {
    // Email regex
    let _regex = Regex::new(
        r"^([a-z0-9_+]([a-z0-9_+.]*[a-z0-9_+])?)@([a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,6})",
    )
    .unwrap();
    provide_meta_context();

    let register_user = create_server_action::<RegisterUser>();

    let nav = use_navigate();
    let modal_ref = create_node_ref::<html::Div>();
    modal_ref.on_load(move |loaded| {
        loaded.on_mount(move |mounted| {
            cfg_if! {
                if #[cfg(feature = "hydrate")] {
                    use crate::utils::modal::show_modal;
                    show_modal("registerModal");
            }};
            let show_modal = EventListener::new(&mounted, "hide.bs.modal", move |_event| {
                nav("/", Default::default());
            });

            on_cleanup(move || drop(show_modal));
        });
    });

    view! {
        <ActionForm
            on:submit=move |ev| {
                let _data = RegisterUser::from_event(&ev).expect("to parse form data");
            }

            action=register_user
        >
            <div class="modal mt-5 fade" id="registerModal" _ref=modal_ref tabindex="-1">
                <div class="modal-dialog modal-sm" role="document">
                    <div class="modal-content">
                        <div class="modal-status bg-info"></div>

                        <div class="modal-body">

                            <div class="text-center py-4">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="icon icon-tabler icon-tabler-api-app mb-2 text-blue icon-lg"
                                    width="40"
                                    height="40"
                                    viewBox="0 0 24 24"
                                    stroke-width="1"
                                    stroke="currentColor"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M12 15h-6.5a2.5 2.5 0 1 1 0 -5h.5"></path>
                                    <path d="M15 12v6.5a2.5 2.5 0 1 1 -5 0v-.5"></path>
                                    <path d="M12 9h6.5a2.5 2.5 0 1 1 0 5h-.5"></path>
                                    <path d="M9 12v-6.5a2.5 2.5 0 0 1 5 0v.5"></path>
                                </svg>
                                <h3>"Registration required!"</h3>
                                <div class="text-muted">
                                    "Your account is not yet registered, you must register first before you can proceed! Registering indicates your acceptance to our "
                                    <a href="/tos" class="nav-link px-2 text-muted">
                                        {"Terms of Service"}
                                    </a>
                                </div>
                            </div>
                            <div class="mx-auto text-left import-left">
                                <div class="mb-3">
                                    <label class="form-label text-left">"Displayname"</label>
                                    <input
                                        type="text"
                                        class="form-control flex-fill"
                                        name="displayname"
                                        placeholder=""
                                    />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-left import-left">
                                        "Email"
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control flex-fill"
                                        name="email"
                                        placeholder=""
                                    />
                                </div>
                                <div class="mb-3">
                                    <label class="form-label text-left import-left">
                                        "Project (optional)"
                                    </label>
                                    <input
                                        type="text"
                                        class="form-control flex-fill"
                                        name="project"
                                        placeholder=""
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="modal-footer">
                            <a
                                href="/"
                                class="btn"
                                data-bs-dismiss="modal"
                                data-bs-target="#registerModal"
                            >
                                "Cancel"
                            </a>
                            <button type="submit" class="btn btn-primary ms-auto">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    class="icon icon-tabler icon-tabler-plus"
                                    width="24"
                                    height="24"
                                    viewBox="0 0 24 24"
                                    stroke-width="1"
                                    stroke="currentColor"
                                    fill="none"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                >
                                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                                    <path d="M12 5l0 14"></path>
                                    <path d="M5 12l14 0"></path>
                                </svg>
                                "Register"
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ActionForm>
        {move || {
            match register_user.value().get() {
                Some(v) => {
                    match v {
                        Ok(_) => {
                            view! {
                                ,
                                <Redirect path="/activate"/>
                            }
                                .into_view()
                        }
                        Err(_) => {
                            view! {
                                ,
                                <Redirect path="/"/>
                            }
                                .into_view()
                        }
                    }
                }
                None => ().into_view(),
            }
        }}
    }
}

/// Renders the home page of your application.
#[component]
pub fn ActivatePage() -> impl IntoView {
    provide_meta_context();
    let check_activated = create_server_action::<CheckActivated>();

    let activated = move || {
        check_activated
            .value()
            .get()
            .and_then(|r| r.ok())
            .unwrap_or(false)
    };

    #[cfg(feature = "hydrate")]
    let handle = set_interval_with_handle(
        move || {
            check_activated.dispatch(CheckActivated {});
        },
        Duration::from_secs(10), // every 10 seconds for now
    )
    .unwrap();

    let nav = use_navigate();
    let activate_ref = create_node_ref::<html::Div>();
    activate_ref.on_load(move |loaded| {
        loaded.on_mount(move |mounted| {
            cfg_if! {
                if #[cfg(feature = "hydrate")] {
                    use crate::utils::modal::show_modal;
                    show_modal("activateModal");
            }};
            let show_modal = EventListener::new(&mounted, "hide.bs.modal", move |_event| {
                #[cfg(feature = "hydrate")]
                handle.clear();
                nav("/", Default::default());
            });

            on_cleanup(move || drop(show_modal));
        });
    });

    view! {
        <div
            class="modal fade"
            id="activateModal"
            tabindex="-1"
            _ref=activate_ref
            style="display: block; padding-left: 0px;"
        >
            <div class="modal-dialog modal-sm modal-dialog-centered" role="document">
                <div class="modal-content">
                    <button
                        type="button"
                        class="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        data-bs-target="#activateModal"
                    ></button>
                    <div class="modal-status bg-success"></div>
                    <div class="modal-body text-center py-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="icon icon-tabler icon-tabler-user-check icon-lg text-green"
                            width="40"
                            height="40"
                            viewBox="0 0 24 24"
                            stroke-width="1"
                            stroke="currentColor"
                            fill="none"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        >
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                            <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0"></path>
                            <path d="M6 21v-2a4 4 0 0 1 4 -4h4"></path>
                            <path d="M15 19l2 2l4 -4"></path>
                        </svg>
                        <h3 class="pt-4">"Registration complete!"</h3>
                        <div class="text-muted">
                            "Your account will be reviewed and activated by an administrator. If your account gets activated this page will automatically forward you to the management panel and (if specified) you will receive an e-mail notification."
                        </div>
                    </div>
                    <div class="modal-footer">
                        <div class="w-100">
                            <div class="row">
                                <div class="col">
                                    <a
                                        class="btn w-100"
                                        data-bs-dismiss="modal"
                                        data-bs-target="#activateModal"
                                    >
                                        "Back"
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {move || {
            activated()
                .then(|| {
                    hide_modal("activateModal");
                    view! { <Redirect path="/panel"/> }
                })
        }}
    }
}
