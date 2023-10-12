export default function ErrorBlock({msg}) {
    return(
        <div className="d-block text-danger small mt-2">
            {msg}
        </div>
    )
}