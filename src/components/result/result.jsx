import Dateformat from "../sidebar/dateFormat";



export default function Result(){
    return (
        <div id="resultWikipedia">
            {resultCount < 0 ? (
                "the result will be displayed here"
            ) : resultWikipedia.length == 0 ? (
                "there is not result for that user"
            ) : (
                <>
                    <h4 className="resultTitle">
                        The result for the user {usernames} are{" "}
                        {resultWikipedia.length}
                    </h4>
                    <div className="result">
                        <h5>user</h5>
                        <h5>Title</h5>
                        <h5>Date </h5>
                    </div>
                    {resultWikipedia?.map((el, index) => (
                        <div key={index} className="result">
                            <h6> {el.user}</h6>
                            <h6>{el.title}</h6>
                            <h6>{Dateformat(el.timestamp)}</h6>
                        </div>
                    ))}
                </>
            )}
        </div>
    )
}