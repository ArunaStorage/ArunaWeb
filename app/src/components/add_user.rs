use crate::utils::structs::UpdateAdmin;
use leptos::*;
use leptos_meta::*;
use leptos_router::*;

#[server(AddUserProject, "/web")]
pub async fn add_user_project(
    _user_id: String,
    _project_id: String,
    _perm: i32,
) -> Result<(), ServerFnError> {
    // use crate::utils::aruna_api_handlers::aruna_add_user_to_proj;
    // use actix_session::SessionExt;
    // use actix_web::HttpRequest;
    // let req = use_context::<HttpRequest>().unwrap();

    // let sess = req.get_session();

    // let token = sess
    //     .get::<String>("token")
    //     .map_err(|_| ServerFnError::Request("Invalid request".to_string()))?
    //     .ok_or_else(|| ServerFnError::Request("Invalid request".to_string()))?;

    // let _resp = aruna_add_user_to_proj(&token, &user_id, &project_id, perm)
    //     .await
    //     .map_err(|_| ServerFnError::Request("Invalid request".to_string()))?;

    Ok(())
}

/// Renders the home page of your application.
#[component]
pub fn AddUserProject(user_id: String) -> impl IntoView {
    provide_meta_context();

    let activate_user = create_server_action::<AddUserProject>();
    let update_admin = use_context::<UpdateAdmin>().expect("user_state not set");

    let current_state = create_rw_signal(0);

    create_effect(move |_| {
        if activate_user.version()() > current_state() {
            update_admin.0.update(|e| *e = !*e);
            current_state.set_untracked(activate_user.version()())
        }
    });

    view! {
        <div class="modal" id=format!("ACU{}", user_id) tabindex="-1">
            <div class="modal-dialog modal-sm" role="document">
                <div class="modal-content">
                    <ActionForm
                        on:submit=move |ev| {
                            let _data = AddUserProject::from_event(&ev)
                                .expect("to parse form data");
                        }

                        action=activate_user
                    >
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                        <div class="modal-status bg-success"></div>
                        <div class="modal-body text-center py-4">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="icon icon-tabler icon-tabler-user-check icon-lg text-success"
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
                            <h3>{"Add user to project"}</h3>
                            <div class="text-muted mb-3">{format!("ID: {user_id}")}</div>
                            <div class="form-floating mb-3">
                                <input
                                    type="text"
                                    class="form-control text-lowercase"
                                    id="projid"
                                    name="project_id"
                                    placeholder="Project ID"
                                    required
                                />
                                <label for="projid">"Project ULID"</label>
                                <div class="invalid-feedback">
                                    "Invalid ULID expected format: '01BX5ZZKBKACTAV9WEVGEMMVRY'"
                                </div>
                            </div>
                            <input type="hidden" id="userId" name="user_id" value=user_id.clone()/>
                            <div class="form-floating mb-3">
                                <select
                                    class="form-select"
                                    id="selectperm"
                                    name="perm"
                                    aria-label="Token permissions"
                                    required
                                >
                                    <option value=1 selected>
                                        "NONE"
                                    </option>
                                    <option value=2>"READ"</option>
                                    <option value=3>"APPEND"</option>
                                    <option value=4>"MODIFY"</option>
                                    <option value=5>"ADMIN"</option>
                                </select>
                                <label for="selectperm">"Project permissions"</label>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <div class="w-100">
                                <div class="row">
                                    <div class="col">
                                        <a href="#" class="btn w-100" data-bs-dismiss="modal">
                                            "Cancel"
                                        </a>
                                    </div>
                                    <div class="col">
                                        <button
                                            href="#"
                                            type="submit"
                                            class="btn btn-success w-100"
                                            data-bs-dismiss="modal"
                                        >
                                            "Activate"
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ActionForm>
                </div>
            </div>
        </div>
    }
}
